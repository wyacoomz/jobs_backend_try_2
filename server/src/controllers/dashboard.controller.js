// dashboard.controller.js
import User        from "../models/User.js";
import Application from "../models/Application.js";
import Job         from "../models/Jobs.js";
import Recruiter   from "../models/Recruiter.js";

/* --------------------------------------------------
   ALL USERS DASHBOARD
-------------------------------------------------- */
export const userDashboard = async (_req, res, next) => {
  try {
    const users = await User.find()
      .populate({
        path: "savedJobs",
        populate: { path: "recruiter", select: "name companyName" },
      })
      .lean();

    // For every user, also fetch their applications
    const results = await Promise.all(
      users.map(async (u) => {
        const applied = await Application.find({ applicant: u._id })
          .populate({
            path: "job",
            populate: { path: "recruiter", select: "name companyName" },
          })
          .lean();

        return {
          userId: u._id,
          name:   u.name,
          email:  u.email,
          savedJobs: u.savedJobs,
          appliedJobs: applied.map(app => ({
            ...app.job,
            appliedAt: app.createdAt,
            status:    app.status,
          })),
        };
      })
    );

    res.json(results);
  } catch (err) { next(err); }
};

/* --------------------------------------------------
   ALL RECRUITERS DASHBOARD
-------------------------------------------------- */
export const recruiterDashboard = async (_req, res, next) => {
  try {
    const recruiters = await Recruiter.find()
      .populate("user", "name email")
      .lean();

    const results = await Promise.all(
      recruiters.map(async (r) => {
        const [jobCount, appCount] = await Promise.all([
          Job.countDocuments({ recruiter: r.user._id }),
          Application.countDocuments({
            job: { $in: await Job.find({ recruiter: r.user._id }).distinct("_id") },
          }),
        ]);

        return {
          recruiterId: r.user._id,
          name: r.user.name,
          companyName: r.companyName,
          jobsPosted: jobCount,
          applicationsReceived: appCount,
          walletBalance: r.wallet?.balance || 0,
        };
      })
    );

    res.json(results);
  } catch (err) { next(err); }
};