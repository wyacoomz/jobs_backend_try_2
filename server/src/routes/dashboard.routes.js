import express from "express";

import {
  userDashboard,
  recruiterDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// user
router.get("/user", userDashboard);

// recruiter
router.get("/recruiter", recruiterDashboard);

export default router;