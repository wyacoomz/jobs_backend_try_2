import User from "../models/User.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

export const countActiveUsers = async (_, res, next) => {
  try {
    const active = await User.countDocuments({ role: "user", isActive: true });
    res.json({ active });
  } catch (err) { next(err); }
};