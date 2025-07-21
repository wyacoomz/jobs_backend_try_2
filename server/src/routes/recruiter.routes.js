import express from "express";
import { countActiveRecruiters } from "../controllers/recruiter.controller.js";

const router = express.Router();
router.get("/", countActiveRecruiters);

export default router;