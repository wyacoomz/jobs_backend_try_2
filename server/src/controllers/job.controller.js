import Job from "../models/Jobs.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

/* CREATE JOB */
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user.id });
    res.status(201).json(job);
  } catch (err) { next(err); }
};

/* RECRUITER – EDIT OWN JOB */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found or not yours" });
    res.json(job);
  } catch (err) { next(err); }
};

/* RECRUITER – DELETE OWN JOB */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user.id,
    });
    if (!job) return res.status(404).json({ error: "Job not found or not yours" });
    res.json({ message: "Job deleted" });
  } catch (err) { next(err); }
};

/* LIST / SEARCH JOBS (public) */
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
    if (category) filter.category = { $regex: category, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("recruiter", "name companyName");
    res.json(jobs);
  } catch (err) { next(err); }
};

/* RECRUITER – JOBS THEY POSTED */
export const myPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });
    res.json(jobs);
  } catch (err) { next(err); }
};

/* USER – SAVE JOB FOR LATER */
export const saveJob = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedJobs: req.params.id } }
    );
    res.json({ message: "Job saved" });
  } catch (err) { next(err); }
};

export const unsaveJob = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedJobs: req.params.id } }
    );
    res.json({ message: "Job unsaved" });
  } catch (err) { next(err); }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedJobs",
        populate: { path: "recruiter", select: "name companyName" },
      });
    res.json(user.savedJobs);
  } catch (err) { next(err); }
};

/* USER – APPLY TO JOB */
export const applyJob = async (req, res, next) => {
  try {
    const exists = await Application.findOne({ job: req.params.id, applicant: req.user.id });
    if (exists) return res.status(400).json({ error: "Already applied" });

    const user = await User.findById(req.user.id).sekect("resume");
    if(!user || !user.resume) return 
    res.status(400).json({ error: "Resume not uploaded"});

    const app = await Application.create({
      job: req.params.id,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume,
    });
    res.status(201).json(app);
  } catch (err) { next(err); }
};

/* USER – ALL APPLICATIONS (past jobs) */
export const myApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate({
        path: "job",
        populate: { path: "recruiter", select: "name companyName" },
      });
    res.json(apps);
  } catch (err) { next(err); }
};