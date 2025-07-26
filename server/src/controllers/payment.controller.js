import razorpay from "razorpay";
import crypto from "crypto";
import Job from "../models/Jobs.js";
import Transaction from "../models/Transaction.js";
import AdminSettings from "../models/AdminSettings.js";

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */

// Fetch current job post unit price from admin settings (or fallback to ₹20)
async function getJobUnitPrice() {
  const settings = await AdminSettings.findOne();
  return settings?.jobPostPrice ?? 20; // Default price per job post if not set in DB
}

const VIEW_PRICE = 20; // ₹20 fixed charge to view one candidate's phone number

/* ================================================== */
/*  1. Create Razorpay Order for Job Post Payment     */
/*     - Recruiter wants to post a job                */
/*     - Frontend first sends job form                */
/*     - Server calculates total based on price/unit  */
/* ================================================== */
export const createJobPostOrder = async (req, res, next) => {
  try {
    const unitPrice = await getJobUnitPrice(); // get current rate per job post
    const jobpostCount = req.body.jobpost || 1; // number of slots recruiter selected
    const totalAmount = unitPrice * jobpostCount;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // in paisa
      currency: "INR",
      receipt: `job_${req.user.id}_${Date.now()}`,
    });

    res.json({ order, unitPrice, totalAmount });
  } catch (err) {
    next(err);
  }
};

/* ================================================== */
/*  2. Verify Job Post Payment                        */
/*     - After successful payment, Razorpay sends     */
/*       payment details to be verified               */
/*     - If valid, job gets posted and stored in DB   */
/* ================================================== */
export const verifyJobPostPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobData } = req.body;

    // Generate server-side signature to validate payment
    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    // Create the job in DB with paid jobpost count
    const job = await Job.create({
      ...jobData,
      recruiter: req.user.id,
    });

    // Save transaction record
    await Transaction.create({
      user: req.user.id,
      amount: await getJobUnitPrice() * job.jobpost, // full total
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

/* ================================================== */
/*  3. Create Razorpay Order to View a Phone Number   */
/*     - Recruiter wants to view a user’s number      */
/*     - Can be used with or without a job post       */
/* ================================================== */
export const createPhoneViewOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const order = await razorpay.orders.create({
      amount: VIEW_PRICE * 100, // ₹20 in paisa
      currency: "INR",
      receipt: `phone_${userId}_${req.user.id}_${Date.now()}`,
    });

    res.json({ order, price: VIEW_PRICE });
  } catch (err) {
    next(err);
  }
};

/* ================================================== */
/*  4. Verify Phone Number View Payment               */
/*     - After successful ₹20 payment                 */
/*     - No jobpost is decremented here               */
/* ================================================== */
export const verifyPhoneViewPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { userId } = req.params;

    // Validate payment signature
    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    // Record this phone view purchase
    await Transaction.create({
      user: req.user.id,
      amount: VIEW_PRICE,
      type: "debit",
      purpose: "phone-view",
      reference: userId, // can be used to track which user they viewed
      razorpay_payment_id,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
