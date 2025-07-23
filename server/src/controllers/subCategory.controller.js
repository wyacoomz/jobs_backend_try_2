import SubCategory from "../models/SubCategory.js";

export const createSubCategory = async (req, res) => {
  const { name, category } = req.body;
  try {
    const sub = await SubCategory.create({ name, category });
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSubCategories = async (_req, res) => {
  const subs = await SubCategory.find().populate("category", "name");
  res.json(subs);
};

export const updateSubCategory = async (req, res) => {
  const { name, category } = req.body;
  const updated = await SubCategory.findByIdAndUpdate(
    req.params.id,
    { name, category },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "SubCategory not found" });
  res.json(updated);
};

export const deleteSubcategory = async (req, res) => {
  const deleted = await SubCategory.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "SubCategory not found" });
  res.json({ message: "Subcategory deleted" });
};