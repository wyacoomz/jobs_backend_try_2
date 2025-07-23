// admin.routes.js
import express from "express";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";

const router = express.Router();

// GET /api/admin/users -> all users (password excluded)
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/recruiters -> all recruiters (password excluded)
router.get("/recruiters", async (req, res, next) => {
  try {
    const recruiters = await Recruiter.find().select("-password");
    res.json(recruiters);
  } catch (err) {
    next(err);
  }
});

export default router;