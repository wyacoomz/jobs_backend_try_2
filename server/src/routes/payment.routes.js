// src/routes/payment.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createJobPostOrder,
  verifyJobPostPayment,
  createPhoneViewOrder,
  verifyPhoneViewPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Middleware: allow only recruiters
const recruiterOnly = (req, res, next) =>
  req.account?.constructor.modelName === "Recruiter"
    ? next()
    : res.status(403).json({ error: "Recruiter only" });

// Job Post Payment Routes
router.post("/job-post/order", protect, recruiterOnly, createJobPostOrder);     // create order for job post
router.post("/job-post/verify", protect, recruiterOnly, verifyJobPostPayment); // verify job post payment

// Phone View Payment Routes
router.post("/phone-view/order/:userId", protect, recruiterOnly, createPhoneViewOrder);     // order to view phone
router.post("/phone-view/verify/:userId", protect, recruiterOnly, verifyPhoneViewPayment); // verify phone view payment

export default router;
