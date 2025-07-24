
import Razorpay from "razorpay";
import crypto from "crypto";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Job from "../models/Jobs.js";
import Recruiter from "../models/Recruiter.js";
import AdminSettings from "../models/AdminSettings.js";

async function getJobUnitPrice() {
  const settings = await AdminSettings.findOne();
  return settings?.jobPostPrice ?? 20;   // default ₹20
}

const VIEW_PRICE = 20; // ₹20 to view a candidate's mobile number

/* --------------------------------------------------
   1. Create Razorpay order for wallet top-up
-------------------------------------------------- */
export const createWalletOrder = async (req, res) => {
  const { amount } = req.body;
  if (![100, 300, 500].includes(amount) && amount < 100)
    return res.status(400).json({ error: "Invalid amount (min 100)" });

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `wallet_${req.user.id}_${Date.now()}`,
  });
  res.json(order);
};

/* --------------------------------------------------
   2. Verify payment and credit wallet
-------------------------------------------------- */
export const verifyWalletPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generated = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                          .update(razorpay_order_id + "|" + razorpay_payment_id)
                          .digest("hex");

  if (generated !== razorpay_signature)
    return res.status(400).json({ error: "Invalid signature" });

  const amount = Number(req.body.amount);
  await Wallet.updateOne(
    { user: req.user.id },
    { $inc: { balance: amount } },
    { upsert: true }
  );
  await Transaction.create({
    user: req.user.id,
    amount,
    type: "credit",
    purpose: "wallet-topup",
    razorpay_payment_id,
  });
  res.json({ success: true, message: "Wallet credited" });
};

// 3. post job -paid  for recruiters price depends on the admin 

export const verifyJobPostPayment = async (req, res , next )=>{
 try{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobData } = req.body;
  const generated = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (generated !== razorpay_signature) return res.status(400).json({error: "Invalid signature"});

  const unitPrice = await getJobUnitPrice();
  const job = await Job.create( {...jobData, recruiter: req.account.id});
  await Transaction.create({
    user: req.account.id,
    amount: unitPrice,
    type: "debit",
    purpose: "job-post",
    reference: job._id,
    razorpay_payment_id,
  });
  res.status(201).json(job)
 }catch (err) {
  next(err);
 }
};



//  4. View candidate mobile - charge 20 rs 
export const viewCandidateMobile = async (req, res) => {
  const recruiter = await Recruiter.findOne({user: req.user.id});
  if ( !recruiter ) return res.status(400).json({ error: "Recruiter not found "});
  if (recruiter.wallet.balance < VIEW_PRICE)
    return res.status(402).json({ error: "Insufficient balance" });

  recruiter.wallet.balance -= VIEW_PRICE;
  await recruiter.save();
  await Transaction.create({
    user: req.user.id,
    amount: VIEW_PRICE,
    type: "debit",
    purpose: "view-candidate-mobile",
    reference: req.params.jobId,
  });
  res.json({ message : "Mobile unlocked" });
};

//  5. get wallet balance 

export const wallet = async (req, res) =>{
  const w= await Wallet.findOne({ user: req.user.id });
  res.json({ balance : w?.balance ||0 });
};

// 6. Create Razorpay order for job-post (pay-per-post)
export const createJobPostOrder = async (req, res, next) => {
  try {
    const unitPrice = await getJobUnitPrice();
    const order = await razorpay().orders.create({
      amount: unitPrice * 100,
      currency: "INR",
      receipt: `job_${req.account.id}_${Date.now()}`,
    });
    res.json({ order, unitPrice });
  } catch (err) {
    next(err);
  }
};