import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const POST_PRICE = 100;

/* TOP-UP WALLET (fake payment) */
export const addMoney = async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });

  wallet.balance += amount;
  await wallet.save();
  await Transaction.create({ user: req.user.id, amount, type: "credit" });
  res.json({ balance: wallet.balance });
};

/* POST JOB (₹100 debit) */
export const postJob = async (req, res, next) => {
  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet || wallet.balance < POST_PRICE)
    return res.status(402).json({ error: "Insufficient balance" });

  const job = await Job.create({ ...req.body, recruiter: req.user.id });
  wallet.balance -= POST_PRICE;
  await wallet.save();
  await Transaction.create({ user: req.user.id, amount: POST_PRICE, type: "debit", purpose: "job_post" });

  res.status(201).json(job);
};

/* WALLET BALANCE */
export const wallet = async (req, res) => {
  const w = await Wallet.findOne({ user: req.user.id });
  res.json({ balance: w?.balance || 0 });
};

/* MARK CONTACTED (or auto 7-day expiry) */
export const markContacted = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.body.jobId, recruiter: req.user.id },
    { isActive: false, contacted: true },
    { new: true }
  );
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};