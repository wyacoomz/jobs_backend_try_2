import mongoose from "mongoose";
import User from "./User";

const jobSchema = new mongoose.Schema(
  {
    recruiter:   { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: String,
    location: String,
    type: { type: String, enum: ["full-time","part-time","contract","internship"], default: "full-time" },
    salaryMin: Number,
    salaryMax: Number,
    skills: [String],
    experience: String,
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }, // 7 days
    candidateMatched: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedCount: { type: mongoose.Schema.Types.ObjectId, ref: " User" },
    contacted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);