import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String },
    companySize: { type: Number },
    businessType: { type: String },
    industry: { type: String },
    website: { type: String },
    location: { type: String },
    contactPerson: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: Number },
    hiringNeeds: { type: Number },
    companyLogo: { type: String },
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    wallet: { balanace: {type: Number, default: 0} }
  },
  { timestamps: true }
);

export default mongoose.model("Recruiter", recruiterSchema);