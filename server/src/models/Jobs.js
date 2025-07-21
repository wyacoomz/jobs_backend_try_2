import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter:   { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    title:       { type: String, required: true },          // ← add required if you need it
    description: { type: String, required: true },          // ← fixed
    category:    { type: String, required: true },          // ← fixed
    subCategory: String,
    location: String,
    type: { type: String, enum: ["full-time","part-time","contract","internship"], default: "full-time" },
    salaryMin: Number,
    salaryMax: Number,
    skills: [String],
    experience: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);