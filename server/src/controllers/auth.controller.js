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

// helper function to check if the user is already logged in 
const isLoggedin = (req) => {
  const token= req.cookies.token;
  if (!token) return false;

  try {
    const decoded =jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded;
  } catch (err) {
    return false;
  }

};
// Login with Phone (auto-register if not exists)
export const loginWithPhone = async (req, res, next) => {
   try {
    const { phone, name } = req.body;
    // check if the user is already logged in
    if (isLoggedin(req)) {
      // user is already logged in, send thier info to the recruiter 

      const user = await User.findOne({ phone }).select("+password");
      if(!user) {
        return res.status(404).json({ error: "User not found"});
      }

      res.json ({
        message: "User already logged in", user: {... user.toObject(), password: undefined },
      });
      return;
    }
    //  User is not logged in, process with registration or login 
    let user = await User.findOne ({ phone });
    
    if(!user) {
      // user does not exist, create a new user with name and phone 
      user= await User.create({ name, phone, role: "user"});
    }

    //Generate a new token for the user
    const token = user.generateToken();
    // set the token in the cookie and send the user info 

    res.cookie("token", token, cookieOptions).json({ token, user: { ...user.toObject(), password: undefined},});
   } catch (err) {
    next(err)
   }
}
  






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

// controllers/authController.js

// controllers/authController.js

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select("+password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        user: { ...user.toObject(), password: undefined },
        role: user.role,
      });
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    console.error("Get current user error:", err.message);
    res.status(500).json({ error: "Server error while fetching user" });
  }
};
// get current recruiter 

// controllers/authController.js
// Add this right below getCurrentUser

export const getCurrentRecruiter = async (req, res) => {
  try {
    // Ensure the logged-in user is actually a recruiter
    if (!req.user || !req.role || req.role !== "recruiter") {
      return res.status(401).json({ error: "Not authenticated as recruiter" });
    }

    // Optionally re-fetch to populate extra fields (e.g., jobs they posted)
    const recruiter = await Recruiter.findById(req.user._id)
      // Example: .populate("postedJobs")  // if you have a jobs reference
      .lean();

    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    res.status(200).json({
      user: recruiter,
      role: req.role,
    });
  } catch (err) {
    console.error("Get current recruiter error:", err.message);
    res.status(500).json({ error: "Server error while fetching recruiter" });
  }
};
