// src/routes/payment.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createWalletOrder,
  verifyWalletPayment,
  createJobPostOrder,
  verifyJobPostPayment,
  viewCandidateMobile,
  wallet
} from "../controllers/payment.controller.js";
const router = express.Router();
const recruiterOnly = (req,res,next)=>
  req.account?.constructor.modelName==="Recruiter"?next():res.status(403).json({error:"Recruiter only"});
router.post("/wallet/order",  protect, recruiterOnly, createWalletOrder);
router.post("/wallet/verify", protect, recruiterOnly, verifyWalletPayment);
router.post("/job-post/order",  protect, recruiterOnly, createJobPostOrder);
router.post("/job-post/verify", protect, recruiterOnly, verifyJobPostPayment);
router.post("/jobs/:jobId/candidates/:candidateId/unlock", protect, recruiterOnly, viewCandidateMobile);
router.get("/wallet", protect, recruiterOnly, wallet);
export default router;