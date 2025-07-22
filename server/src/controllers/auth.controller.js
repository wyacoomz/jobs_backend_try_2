import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // convert buffer → base64 string
    const resume = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const user = await User.create({
      name, email, phone, password, role: "user", resume
    });
    res.status(201).json({ message: "User registered", user });
  } catch (err) { next(err); }
};

export const registerRecruiter = async (req, res, next) => {
  try {
    const recruiterFields = { ...req.body, role: "recruiter" };

    recruiterFields.companyLogo = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const recruiter = await User.create(recruiterFields);
    res.status(201).json({ message: "Recruiter registered", recruiter });
  } catch (err) { next(err); }
};

export const loginWithPhone = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = user.generateToken();
    res.json({ token, phone: user.phone });
  } catch (err) { next(err); }
};



// user and recruiter log in by role 

const loginByRole = async (req, res, role) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone, role }).select("-password");
  if (!user) return res.status(404).json({ error: `${role} not found` });

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = user.generateToken();
  return res.json({ token, user });   // ← full object
};

export const loginUser =      async (req, res, next) => loginByRole(req, res, "user");
export const loginRecruiter = async (req, res, next) => loginByRole(req, res, "recruiter");