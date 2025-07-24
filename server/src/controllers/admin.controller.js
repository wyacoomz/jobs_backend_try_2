// src/controllers/admin.controller.js
import AdminSettings from "../models/AdminSettings.js";

export const getJobPostPrice = async (req, res) => {
  const s = await AdminSettings.findOne();
  res.json({ price: s?.jobPostPrice ?? 20 });
};

export const setJobPostPrice = async (req, res) => {
  const { price } = req.body;
  if (typeof price !== "number" || price < 1)
    return res.status(400).json({ error: "Price must be ≥ 1" });
  await AdminSettings.findOneAndUpdate({}, { jobPostPrice: price }, { upsert: true, new: true });
  res.json({ message: "Price updated", price });
};