import express from "express";
import { countActiveRecruiters, updateRecruiterProfile } from "../controllers/recruiter.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", countActiveRecruiters); // stats
router.put("/", updateRecruiterProfile) // edit

export default router;