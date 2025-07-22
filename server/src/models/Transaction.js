import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    purpose: { type: String, default: "general" },
    reference: String, // future payment-gateway order_id
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);