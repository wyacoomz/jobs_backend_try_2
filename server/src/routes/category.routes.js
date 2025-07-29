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

router.get("/:categoryName/jobs", getJobsByCategory)
router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

// test route 
router.get('/test', (req, res) => {
  res.send('Category test route works');
});



export default router;
