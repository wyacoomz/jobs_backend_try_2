import Category from "../models/Category.js";

const adminOnly = (req) => req.user.role === "admin";

// GET /api/category
export const getCategories = async (_, res, next) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) { next(err); }
};

// POST /api/category
export const createCategory = async (req, res, next) => {
  if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

// PUT /api/category/:id
export const updateCategory = async (req, res, next) => {
  if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/category/:id
export const deleteCategory = async (req, res, next) => {
  if (!adminOnly(req)) return res.status(403).json({ error: "Admin only" });
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};