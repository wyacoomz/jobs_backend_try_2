import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";
import jwt from "jsonwebtoken";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
      resume: req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        : null,
    });
    const token = user.generateToken();
    res.cookie("token", token, cookieOptions).status(201).json({
      message: "User registered",
      token,
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    next(err);
  }
};

// Register Recruiter
export const registerRecruiter = async (req, res, next) => {
  try {
    const payload = { ...req.body, role: "recruiter" };
    payload.companyLogo = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;
    const recruiter = await Recruiter.create(payload);
    const token = recruiter.generateToken();
    res.cookie("token", token, cookieOptions).status(201).json({
      message: "Recruiter registered",
      token,
      user: { ...recruiter.toObject(), password: undefined },
    });
  } catch (err) {
    next(err);
  }
};

// Login with Phone (auto-register if not exists)
export const loginWithPhone = async (req, res, next) => {
  try {
    const { phone, name } = req.body;
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ name, phone, role: "user" });
    }

    const token = user.generateToken();

    res.cookie("token", token, cookieOptions).json({
      token,
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    next(err);
  }
};

// Login as User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || (user.role !== "user" && user.role !== "admin")) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = user.generateToken();
    res.cookie("token", token, cookieOptions).json({
      token,
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    next(err);
  }
};

// Login as Recruiter
export const loginRecruiter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email }).select("+password");

    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    const match = await recruiter.matchPassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = recruiter.generateToken();
    res.cookie("token", token, cookieOptions).json({
      token,
      user: { ...recruiter.toObject(), password: undefined },
    });
  } catch (err) {
    next(err);
  }
};
export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions).json({ message: "Logged out" });
};
