/* eslint-disable no-unused-vars */
import Job         from "../models/Jobs.js";
import Application from "../models/Application.js";
import User        from "../models/User.js";

/* =========================================================
   Helpers
========================================================= */
const assertRecruiter = (req) => {
  if (req.account.role !== "recruiter") {
    const err = new Error("Recruiter access required");
    err.status = 403;
    throw err;
  }
};

const assertUser = (req) => {
  if (req.account.role !== "user") {
    const err = new Error("User access required");
    err.status = 403;
    throw err;
  }
};

/* =========================================================
   JOB CRUD  (recruiter only)
   NOTE: createJob is intentionally removed – jobs are created
   only after successful payment in payment.controller.js
========================================================= */

export const updateJob = async (req, res, next) => {
  try {
    assertRecruiter(req);
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.account.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found or not yours" });
    res.json(job);
  } catch (err) { next(err); }
};

export const deleteJob = async (req, res, next) => {
  try {
    assertRecruiter(req);
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.account.id,
    });
    if (!job) return res.status(404).json({ error: "Job not found or not yours" });
    res.json({ message: "Job deleted" });
  } catch (err) { next(err); }
};

/* =========================================================
   PUBLIC JOB LISTING  (open to everyone)
========================================================= */
export const getJobs = async (req, res, next) => {
  try {
    const { keyword, location, category } = req.query;
    const filter = { isActive: true };

    if (keyword)
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;

    const jobs = await Job.find(filter).populate("recruiter", "name companyName");
    res.json(jobs);
  } catch (err) { next(err); }
};

/* =========================================================
   RECRUITER – MY JOBS  (recruiter only)
========================================================= */
export const myPostedJobs = async (req, res, next) => {
  try {
    assertRecruiter(req);
    const jobs = await Job.find({ recruiter: req.account.id });
    res.json(jobs);
  } catch (err) { next(err); }
};

/* =========================================================
   USER – SAVE / UNSAVE / LIST SAVED  (user only)
========================================================= */
export const saveJob = async (req, res, next) => {
  try {
    assertUser(req);
    await User.findByIdAndUpdate(req.account.id, { $addToSet: { savedJobs: req.params.id } });
    res.json({ message: "Job saved" });
  } catch (err) { next(err); }
};

export const unsaveJob = async (req, res, next) => {
  try {
    assertUser(req);
    await User.findByIdAndUpdate(req.account.id, { $pull: { savedJobs: req.params.id } });
    res.json({ message: "Job unsaved" });
  } catch (err) { next(err); }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    assertUser(req);
    const user = await User.findById(req.account.id)
      .populate({ path: "savedJobs", populate: { path: "recruiter", select: "name companyName" } });
    res.json(user.savedJobs);
  } catch (err) { next(err); }
};

/* =========================================================
   USER – APPLY / LIST APPLICATIONS  (user only)
   Decrements jobpost on every apply
========================================================= */
export const applyJob = async (req, res, next) => {
  try {
    assertUser(req);

    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive)
      return res.status(404).json({ error: "Job unavailable" });
    if (job.jobpost <= 0)
      return res.status(410).json({ error: "Job quota exhausted" });

    const exists = await Application.findOne({ job: req.params.id, applicant: req.account.id });
    if (exists) return res.status(400).json({ error: "Already applied" });

    const user = await User.findById(req.account.id).select("resume");
    if (!user || !user.resume)
      return res.status(400).json({ error: "Resume not uploaded" });

    // consume one slot
    job.jobpost -= 1;
    if (job.jobpost <= 0) job.isActive = false;
    await job.save();

    const app = await Application.create({
      job: req.params.id,
      applicant: req.account.id,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume,
    });

    res.status(201).json(app);
  } catch (err) { next(err); }
};

export const myApplications = async (req, res, next) => {
  try {
    assertUser(req);
    const apps = await Application.find({ applicant: req.account.id })
      .populate({ path: "job", populate: { path: "recruiter", select: "name companyName" } });
    res.json(apps);
  } catch (err) { next(err); }
};

/* =========================================================
   RECRUITER – APPLICANT LISTS  (recruiter only)
========================================================= */
export const listApplications = async (req, res, next) => {
  try {
    assertRecruiter(req);
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.account.id });
    if (!job) return res.status(404).json({ error: "Job not found or not yours" });

    const apps = await Application.find({ job: req.params.id })
      .populate("applicant", "name skills");
    res.json(apps.map(a => ({
      userId: a.applicant._id,
      name:   a.applicant.name,
      skills: a.applicant.skills || []
    })));
  } catch (err) { next(err); }
};