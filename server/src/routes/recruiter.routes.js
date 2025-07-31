import express from "express";
import { countActiveRecruiters, getUsersForRecruiterJobs, updateRecruiterProfile } from "../controllers/recruiter.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", countActiveRecruiters); // stats
router.put("/", updateRecruiterProfile) // edit
router.get("applicants", protect, getUsersForRecruiterJobs) // to get the users who have applied to the job post

export default router;