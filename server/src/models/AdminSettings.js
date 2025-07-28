
import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema(
  {
    jobPostPrice: { type: Number, default: 20} // price per job post
  },
  { timestamps: true }
);

export default mongoose.model("AdminSettings", AdminSettingsSchema);