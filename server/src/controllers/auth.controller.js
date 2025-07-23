import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.create({
      name, email, phone, password, role: "user", resume: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}` : null
    });
    res.status(201).json({ message: "User registered", user });
  } catch (err) { next(err); }
};

// auth.controller.js
import Recruiter from "../models/Recruiter.js";

export const registerRecruiter = async (req, res, next) => {
  try {
    const payload = { ...req.body, role: "recruiter" };
    payload.companyLogo = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;
    const recruiter = await Recruiter.create(payload);
    res.status(201).json({ message: "Recruiter registered", recruiter });
  } catch (err) {
    next(err);
  }
};


export const loginWithPhone = async (req, res, next) => {
  try {
    const { phone, name } = req.body;
    let user = await User.findOne({ phone });

    if (!user) {
      // auto-register with phone + name only (no password)
      user = await User.create({ name, phone, role: "user" });
    }

    const token = user.generateToken();
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    next(err);
  }
};
// auth.controller.js
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || user.role !== "user") return res.status(404).json({ error: "User not found" });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = user.generateToken();
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) { next(err); }
};

export const loginRecruiter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email }).select("+password");
    if (!recruiter) return res.status(404).json({ error: "Recruiter not found" });
    const match = await recruiter.matchPassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = recruiter.generateToken();
    res.json({ token, user: { ...recruiter.toObject(), password: undefined } });
  } catch (err) {
    next(err);
  }
};