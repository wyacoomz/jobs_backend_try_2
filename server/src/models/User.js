// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true},
    phone: String,
    DOB: String,
    City: String,
    Qualification: String,
    Skill: [String],
    password: { type: String},
    role: { type: String, enum: ["user", "recruiter", "admin"], default: "user" },
    resume: { type: String },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
    unlockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default mongoose.model("User", userSchema);