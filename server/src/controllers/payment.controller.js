// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Wallet from "../models/Wallet.js";
// import Transaction from "../models/Transaction.js";
// import Job from "../models/Jobs.js";
// import Recruiter from "../models/Recruiter";


// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   ket_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// //  1. create razorpay order for wallet topup

// export const createWalletOrder = async (req, res) => {
//   const { amount } = req.body;
//   if(![100, 300, 500].includes(amount) && amount <100)
//     return res.status(400).json({ message: "Invalid amount (min abount is 100)" });
//   const order = await razorpay.orders.create({
//     amount: amount * 100, // convert to paise
//     currency: "INR",
//     receipt: `wallet_${reportError.user.id}_${Date.now()}`,
//   });
//   res.json(order);
// };

// //  2. verify payment & credit wallet 

// export const verifyWalletPayment = async (req, res) =>{
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   const generated = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex";
//     if (generated !== razorpay_signature)
//       return res.status(400).json({ error : " Invalid signature"});
//     const amount = Number(req.body.amount);
//     await Wallet.updateOne(
//       {user: req.user.id},
//       {$inc: {balance: amount}},
//       {upsert: true}
//     );
//     await Transaction.create({
//       user: req.user.id,
//       amount,
//       type: "credit",
//       purpose: "wallet-topup",
//       razorpay_payment_id,
//     });
//   )
// }