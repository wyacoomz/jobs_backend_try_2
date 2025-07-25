// src/routes/payment.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createJobPostOrder,
  verifyJobPostPayment,
  } from "../controllers/payment.controller.js";
const router = express.Router();
const recruiterOnly = (req,res,next)=>
  req.account?.constructor.modelName==="Recruiter"?next():res.status(403).json({error:"Recruiter only"});

router.post("/job-post/order",  protect, recruiterOnly, createJobPostOrder);
router.post("/job-post/verify", protect, recruiterOnly, verifyJobPostPayment);
export default router;