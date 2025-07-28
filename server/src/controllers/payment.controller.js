import Razorpay from "razorpay";
import crypto from "crypto";
import Job from "../models/Jobs.js";
import Transaction from "../models/Transaction.js";
import AdminSettings from "../models/AdminSettings.js";
import config from "../config/env.config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const VIEW_PRICE = 20; // ₹20 fixed for viewing one phone number

function generateShortReceipt(prefix = "r") {
  return `${prefix}_${Date.now().toString().slice(-10)}_${Math.random().toString(36).slice(2, 6)}`.slice(0, 40);
}

async function getJobUnitPrice() {
  const settings = await AdminSettings.findOne();
  return settings?.jobPostPrice ?? 20;
}

export const createJobPostOrder = async (req, res) => {
  try {
    const jobPostCount = Number(req.body.jobpost) || 1;

    if (jobPostCount <= 0 || !Number.isInteger(jobPostCount)) {
      return res.status(400).json({ error: "Invalid jobpost value. Must be a positive integer." });
    }

    const unitPrice = await getJobUnitPrice();
    const totalAmount = unitPrice * jobPostCount;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: generateShortReceipt("job"),
    });

    res.json({ order, unitPrice, totalAmount });
  } catch (err) {
    console.error("Error creating job post order:", err);
    res.status(500).json({ error: "Failed to create job post order. Please try again later." });
  }
};

export const verifyJobPostPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobData } = req.body;

    // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !jobData) {
    //   return res.status(400).json({ error: "Missing payment or job data" });
    // }

    const generated = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const unitPrice = await getJobUnitPrice();
    const jobPostsPurchased = Math.max(Math.round(jobData.jobpost), 1);

    const job = await Job.create({
      ...jobData,
      recruiter: req.user.id,
      jobpost: jobPostsPurchased,
    });

    await Transaction.create({
      user: req.user.id,
      amount: unitPrice * jobPostsPurchased,
      type: "debit",
      purpose: "job-post",
      reference: job._id,
      razorpay_payment_id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Error verifying job post payment:", err);
    res.status(500).json({ error: "Payment verification failed. Please contact support." });
  }
};

export const createPhoneViewOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request" });
    }

    const order = await razorpay.orders.create({
      amount: VIEW_PRICE * 100,
      currency: "INR",
      receipt: generateShortReceipt("phone"),
    });

    res.json({ order, price: VIEW_PRICE });
  } catch (err) {
    console.error("Error creating phone view order:", err);
    res.status(500).json({ error: "Failed to create phone view order. Try again later." });
  }
};

export const verifyPhoneViewPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { userId } = req.params;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ error: "Missing required payment or user information" });
    }

    const generated = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    await Transaction.create({
      user: req.user.id,
      amount: VIEW_PRICE,
      type: "debit",
      purpose: "phone-view",
      reference: userId,
      razorpay_payment_id,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error verifying phone view payment:", err);
    res.status(500).json({ error: "Payment verification failed. Please try again later." });
  }
};
