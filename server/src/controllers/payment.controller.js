import Recruiter  from "../models/Recruiter.js";
import Wallet     from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Job        from "../models/Jobs.js";

const POST_PRICE = 20;
const VIEW_PRICE = 20;

/* --------------------------------------------------
   1. Add money (fake gateway)
-------------------------------------------------- */
export const addMoney = async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });

  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });

  wallet.balance += Number(amount);
  await wallet.save();

  await Transaction.create({
    user: req.user.id,
    amount,
    type: "credit",
    purpose: "add_money",
  });

  res.json({ balance: wallet.balance });
};

/* --------------------------------------------------
   2. Post a job – charge ₹20
-------------------------------------------------- */
export const postJob = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user.id });
    if (!recruiter)
      return res.status(404).json({ error: "Recruiter not found" });
    
    // recruiter can only post 5 jobs at a time
    if (recruiter.jobsPostedCount >=5) {
      return res.status(400).json({ error: "Job posting limit reached (max: 5)" });
    }
    if (recruiter.wallet.balance < POST_PRICE)
      return res.status(402).json({ error: "Insufficient balance to post job" });

    recruiter.wallet.balance -= POST_PRICE;
    await recruiter.save();

    await Transaction.create({
      user: req.user.id,
      amount: POST_PRICE,
      type: "debit",
      purpose: "post_job",
    });

    const job = await Job.create({ ...req.body, recruiter: req.user.id });
    recruiter.jobsPostedCount = (recruiter.jobsPostedCount || 0) + 1;
await recruiter.save();
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------
   3. View candidate mobile – charge ₹20
-------------------------------------------------- */
export const viewCandidateMobile = async (req, res, next) => {
  try {
    const { jobId } = req.params;          // /api/payment/job/:jobId/mobile
    const recruiter = await Recruiter.findOne({ user: req.user.id });

    if (!recruiter)
      return res.status(404).json({ error: "Recruiter not found" });

    if (recruiter.wallet.balance < VIEW_PRICE)
      return res.status(402).json({ error: "Insufficient balance" });

    recruiter.wallet.balance -= VIEW_PRICE;
    await recruiter.save();

    await Transaction.create({
      user: req.user.id,
      amount: VIEW_PRICE,
      type: "debit",
      purpose: "view_mobile_number",
      reference: jobId,
    });

    res.json({ message: "Charged successfully" });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------
   4. Get wallet balance
-------------------------------------------------- */
export const wallet = async (req, res, next) => {
  const w = await Wallet.findOne({ user: req.user.id });
  res.json({ balance: w?.balance || 0 });
};

/* --------------------------------------------------
   5. Mark job as contacted (no extra charge)
-------------------------------------------------- */
export const markContacted = async (req, res, next) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.body.jobId, recruiter: req.user.id },
    { contacted: true, isActive: false },
    { new: true }
  );
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};