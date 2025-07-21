import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createJob,
  getJobs,
  myPostedJobs,
  saveJob,
  updateJob,
  deleteJob,
  unsaveJob,
  getSavedJobs,
  applyJob,
  myApplications,
} from "../controllers/job.controller.js";

const router = express.Router();

// public
router.get("/", getJobs);

// protected
router.post("/", protect, createJob);            // recruiter
router.get("/posted", protect, myPostedJobs);    // recruiter
router.put("/:id", protect, updateJob); // recruiter edit own job
router.delete("/:id", protect, deleteJob); //recruiter delete own job
router.post("/:id/save", protect, saveJob);      // user
router.delete("/:id/save", protect, unsaveJob);  // user
router.get("/saved", protect, getSavedJobs);     // user
router.post("/:id/apply", protect, applyJob);    // user
router.get("/applied", protect, myApplications); // user

export default router;