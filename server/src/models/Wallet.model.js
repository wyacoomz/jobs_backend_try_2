import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    purpose: { type: String, default: "job_post" },
    reference: String, // Razorpay / PayU order_id
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);