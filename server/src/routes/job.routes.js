// src/routes/job.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  
  getJobs,
  myPostedJobs,
  saveJob,
  updateJob,
  deleteJob,
  unsaveJob,
  getSavedJobs,
  applyJob,
  myApplications,
  listApplications,
} from "../controllers/job.controller.js";

const router = express.Router();

// helpers (inline)
const recruiterOnly = (req, res, next) =>
  req.account?.constructor.modelName === "Recruiter"
    ? next()
    : res.status(403).json({ error: "Recruiter access required" });

const userOnly = (req, res, next) =>
  req.account?.constructor.modelName === "User"
    ? next()
    : res.status(403).json({ error: "User access required" });

/* ---------------- PUBLIC ---------------- */
router.get("/", getJobs);

/* ---------------- RECRUITER ONLY -------- */

router.get("/posted",   protect, recruiterOnly, myPostedJobs);
router.put("/:id",      protect, recruiterOnly, updateJob);
router.delete("/:id",   protect, recruiterOnly, deleteJob);
router.get("/:id/applications",protect, recruiterOnly, listApplications);
/* ---------------- USER ONLY ------------- */
router.post("/:id/save",   protect, userOnly, saveJob);
router.delete("/:id/save", protect, userOnly, unsaveJob);
router.get("/saved",       protect, userOnly, getSavedJobs);
router.post("/:id/apply",  protect, userOnly, applyJob);
router.get("/applied",     protect, userOnly, myApplications);

export default router;