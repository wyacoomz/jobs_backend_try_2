// models/Jobs.js  (final – copy/paste)
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company:      { type: String },
    jobpost:      { type: Number, default: 1 }, // remaining phone views / applications
    experience:   { type: String, default: "fresher" },
    location:     { type: String },
    phone:        { type: Number },
    recruiter:    { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    category:     { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory:  String,
    type:         { type: String, default: "full-time" },
    salaryMin:    Number,
    salaryMax:    Number,
    skills:       [String],
    isActive:     { type: Boolean, default: true },
    expiresAt:    { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 },
    candidateMatched: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedCount:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contacted:    { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);