import Razorpay from "razorpay";
import crypto from "crypto";
import Job from "../models/Jobs.js";
import Transaction from "../models/Transaction.js";
import AdminSettings from "../models/AdminSettings.js";
import config from "../config/env.config.js";

/* -------------------------------------------------- */
/*  Initialise Razorpay                               */
/* -------------------------------------------------- */
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */
const VIEW_PRICE = 20; // ₹20 fixed for viewing one phone number

async function getJobUnitPrice() {
  const settings = await AdminSettings.findOne();
  return settings?.jobPostPrice ?? 20;
}

/* -------------------------------------------------- */
/*  1. Create Razorpay order for JOB POST             */
/* -------------------------------------------------- */
export const createJobPostOrder = async (req, res, next) => {
  try {
    const jobPostCount = Number(req.body.jobpost) || 1;
    if (jobPostCount <= 0 || !Number.isInteger(jobPostCount)) {
      return res.status(400).json({ error: "Invalid jobpost value" });
    }

    const unitPrice = await getJobUnitPrice();
    const totalAmount = unitPrice * jobPostCount;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // paisa
      currency: "INR",
      receipt: `job_${req.user.id}_${Date.now()}`,
    });

    res.json({ order, unitPrice, totalAmount });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------- */
/*  2. Verify & store JOB POST payment                */
/* -------------------------------------------------- */
export const verifyJobPostPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobData } = req.body;

    const generated = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // make sure we save the number of job posts user paid for
    const unitPrice = await getJobUnitPrice();
    const jobPostsPurchased = Math.round(jobData.jobpost) || 1;

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
    next(err);
  }
};

/* -------------------------------------------------- */
/*  3. Create order for PHONE VIEW                    */
/* -------------------------------------------------- */
export const createPhoneViewOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const order = await razorpay.orders.create({
      amount: VIEW_PRICE * 100,
      currency: "INR",
      receipt: `phone_${userId}_${req.user.id}_${Date.now()}`,
    });

    res.json({ order, price: VIEW_PRICE });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------- */
/*  4. Verify PHONE VIEW payment                      */
/* -------------------------------------------------- */
export const verifyPhoneViewPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { userId } = req.params;

    const generated = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
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
    next(err);
  }
};