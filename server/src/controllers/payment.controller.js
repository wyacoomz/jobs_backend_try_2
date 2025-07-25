import razorpay from "razorpay";
import crypto from "crypto";
import Job from "../models/Jobs.js";
import Transaction from "../models/Transaction.js";
import AdminSettings from "../models/AdminSettings.js";

/* -------------------------------------------------- */
/*  Helper                                            */
/* -------------------------------------------------- */
async function getJobUnitPrice() {
  const settings = await AdminSettings.findOne();
  return settings?.jobPostPrice ?? 20;   // default ₹20
}

const VIEW_PRICE = 20; // ₹20 to view a candidate's mobile number / apply

/* ================================================== */
/*  1. Job-Post   (unchanged except minor tidy-up)    */
/* ================================================== */
export const createJobPostOrder = async (req, res, next) => {
  try {
    const unitPrice = await getJobUnitPrice();
    const order = await razorpay.orders.create({
      amount: unitPrice * 100,
      currency: "INR",
      receipt: `job_${req.user.id}_${Date.now()}`,
    });
    res.json({ order, unitPrice });
  } catch (err) {
    next(err);
  }
};

export const verifyJobPostPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobData } =
      req.body;

    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    const job = await Job.create({ ...jobData, recruiter: req.user.id });

    await Transaction.create({
      user: req.user.id,
      amount: await getJobUnitPrice(),
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
/*  2. Phone-View   (NEW – pay ₹20 on the spot)       */
/* ================================================== */
export const createPhoneViewOrder = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const order = await razorpay.orders.create({
      amount: VIEW_PRICE * 100,
      currency: "INR",
      receipt: `phone_${jobId}_${req.user.id}_${Date.now()}`,
    });

    res.json({ order, price: VIEW_PRICE });
  } catch (err) {
    next(err);
  }
};

export const verifyPhoneViewPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const { jobId } = req.params;

    /* 1. Signature check */
    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    /* 2. Job lookup & quota check */
    const job = await Job.findById(jobId);
    if (!job || !job.isActive)
      return res.status(404).json({ error: "Job unavailable" });
    if (job.jobpost <= 0)
      return res.status(410).json({ error: "Job quota exhausted" });

    /* 3. Decrement and disable if zero */
    job.jobpost -= 1;
    if (job.jobpost <= 0) job.isActive = false;
    await job.save();

    /* 4. Record transaction */
    await Transaction.create({
      user: req.user.id,
      amount: VIEW_PRICE,
      type: "debit",
      purpose: "phone-view",
      reference: jobId,
      razorpay_payment_id,
    });

    res.json({ success: true, remainingViews: job.jobpost });
  } catch (err) {
    next(err);
  }
};

/* =========================== */
/*  3. OLD WALLET ENDPOINTS    */
/* =========================== */
/* DELETE / IGNORE – no longer needed
export const createWalletOrder
export const verifyWalletPayment
export const wallet
export const viewCandidateMobile
*/