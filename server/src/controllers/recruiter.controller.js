import User from "../models/User.js";

export const countActiveRecruiters = async (_, res, next) => {
  try {
    const active = await User.countDocuments({ role: "recruiter", isActive: true });
    res.json({ active });
  } catch (err) { next(err); }
};