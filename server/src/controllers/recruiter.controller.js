import Recruiter from "../models/Recruiter.js";
import User from "../models/User.js";

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