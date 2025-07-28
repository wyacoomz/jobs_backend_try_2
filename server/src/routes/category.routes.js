// src/routes/category.routes.js
import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getJobsByCategory
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:categoryName/jobs", getJobsByCategory)


export default router;
