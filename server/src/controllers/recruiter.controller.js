import Recruiter from "../models/Recruiter.js";
import User from "../models/User.js";
import Job from "../models/Jobs.js";
import Application from "../models/Application.js";
import app from "../app.js";

export const countActiveRecruiters = async (_, res, next) => {
  try {
    const active = await User.countDocuments({ role: "recruiter", isActive: true });
    res.json({ active });
  } catch (err) { next(err); }
};

export const updateRecruiterProfile = async (req, res) => {
  const allowed = [
  "companyName",
  "industry",
  "website",
  "location",
  "contactEmail",
  "businessType"   // store "About Company" here
];

const payload ={};
Object.keys(req.body).forEach( k =>{
  if (allowed.includes(k)) payload[k] = req.body[k];
});

  try{
    const recruiter = await Recruiter.findOneAndUpdate(
      {user: req.user.id},
      payload,
      {new: true, runValidators: true }
    );
    if(!recruiter) return res.status(404).json({ error: "Recruiter not found" });
    res.json(recruiter);    
  } catch(err) {
    res.status(400).json({error: err.message});
  }
}


// get users who have clicked on a recruiter's job post 

// export const getUsersForRecruiterJobs = async (req , res, next) => {
//   try{
//     //find all the jobs posted by the recruiter
//     const jobs = await Jobs.find({recruiter: req.user.id}).select("_id");
//     const jobIds = jobs.map(j => j.id);
//     // find all applications for these jobs and populate user info 
//     const applications = await Application.find({job: {$in: jobIds}}).populate("user", "-password");

//     //extract unique users
//     const user = [];
//     const userIds = new Set();
//     applications.forEach( a => {
//       if(app.user && !userIds.has(a.user.id.toString())){
//         user.push(app.user);
//         userIds.add(app.user._id.toString());
//   }
// });
// } catch (err) {
//   next(err);
// }
// }






// Get users who have applied to a recruiter's job posts
export const getUsersForRecruiterJobs = async (req, res, next) => {
  try {
    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
    const jobIds = jobs.map(j => j._id);

    // Find all applications for these jobs, and populate applicant info
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "-password");

    // Extract unique applicants
    const users = [];
    const userIds = new Set();
    applications.forEach(app => {
      if (app.applicant && !userIds.has(app.applicant._id.toString())) {
        users.push(app.applicant);
        userIds.add(app.applicant._id.toString());
      }
    });

    res.json({ users });
  } catch (err) {
    next(err);
  }
};