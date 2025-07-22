import Recruiter from "../models/Recruiter.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Job from "../models/Jobs.js";
import User from "../models/User.js";

const VIEW_PRICE = 20; // Charge per view of candidate's mobile number

/* 1. Add money to wallet (fake payment) */
export const addMoney = async (req, res, next) => {
  const { amount } = req.body.amount;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });

  wallet.balance += amount;
  await wallet.save();
  await Transaction.create({ user: req.user.id, amount, type: "credit" });
  res.json({ balance: wallet.balance });
};

/* 2. Post job (recruiters are not charged for posting jobs) */
export const postJob = async (req, res, next) => {
  const job = await Job.create({ ...req.body, recruiter: req.user.id });
  res.status(201).json(job);
};

/* 3. View candidate's mobile number (charge recruiter) */
export const viewCandidateMobile = async (req, res, next) => {
  const { jobId } = req.params.id;
  const recruiterId = req.user.id;

  try {
    const recruiter = await Recruiter.findOne({ user: recruiterId });
    const job = await Job.findById(jobId);

    if (!recruiter || !job) {
      return res.status(404).json({ error: "Recruiter or job not found" });
    }

    if (recruiter.wallet.balance < VIEW_PRICE) {
      return res.status(402).json({ error: "Insufficient balance" });
    }

    recruiter.wallet.balance -= VIEW_PRICE;
    await recruiter.save();

    await Transaction.create({
      user: recruiterId,
      amount: VIEW_PRICE,
      type: "debit",
      purpose: "view_mobile_number",
      reference: jobId.toString(),
    });

    job.viewedCount += 1;
    await job.save();

    res.json({ message: "Charged successfully" });
  } catch (err) { next(err); }
};

export const wallet = async (req, res, next) => {
  const w = await Wallet.findOne({ user: req.user.id });
  res.json({ balance: w?.balance || 0 });
};

export const markContacted = async (req, res, next) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.body.jobId, recruiter: req.user.id },
    { contacted: true, isActive: false },
    { new: true }
  );
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};