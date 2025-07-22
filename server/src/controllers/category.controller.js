
import Category from "../models/Category.js";


// const adminOnly = (req) => req.user.role === "admin";

// PUBLIC
export const getCategories = async (_, res, next) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) { next(err); }
};

// ADMIN ONLY

// CREATE  (with image)
export const createCategory = async (req, res, next) => {
  // if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    const image = req.file ? req.file.path : null;
    const cat = await Category.create({ ...req.body, image });
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

// UPDATE  (with optional image)
export const updateCategory = async (req, res, next) => {
  // if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    const image = req.file ? req.file.path : undefined;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(image && { image }) },
      { new: true }
    );
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE
export const deleteCategory = async (req, res, next) => {
  // if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

