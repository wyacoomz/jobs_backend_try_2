// admin.routes.js
import express from "express";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";
import { getJobPostPrice, setJobPostPrice } from "../controllers/admin.controller.js";
import adminOnly from "../middleware/admin.middleware.js"

const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/recruiters", async (req, res) => {
  const recruiters = await Recruiter.find().select("-password");
  res.json(recruiters);
});

router.get("/price/job-post", getJobPostPrice);          // anyone can read
router.put("/price/job-post", adminOnly, setJobPostPrice); // only admin

export default router;