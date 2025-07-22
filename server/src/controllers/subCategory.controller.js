// src/controllers/SubCategoryController.js
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

export const createSubCategory = async (req, res, next) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: "Invalid input" });

  try {
    const subCat = await SubCategory.create({ name, category });
    res.status(201).json(subCat);
  } catch (err) { next(err); }
};

export const addSubCategory = async (req, res, next) => {
  const { name, category } = req.body;
  const mainCategory = await Category.findById(category);
  if (!mainCategory) return res.status(404).json({ error: "Category not found" });

  const subCat = await SubCategory.create({ name, category });
  res.status(201).json(subCat);
};

export const removeSubCategory = async (req, res, next) => {
  const subCat = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCat) return res.status(404).json({ error: "Subcategory not found" });
  res.json({ message: "Subcategory removed" });
};

export const getSubCategoriesByCategory = async (req, res, next) => {
  const subCategories = await SubCategory.find({ category: req.params.id });
  res.json(subCategories);
};