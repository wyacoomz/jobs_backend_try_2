// models/Recruiter.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const recruiterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "recruiter" },

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
    wallet: { balance: { type: Number, default: 0 } },
    jobsPostedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

recruiterSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

recruiterSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export default mongoose.model("Recruiter", recruiterSchema);