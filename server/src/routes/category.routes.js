// src/routes/category.routes.js
import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getJobsByCategory,
} from "../controllers/category.controller.js";
import { upload } from "../middleware/upload.middleware.js"; // ✅ Import upload middleware

const router = express.Router();

// Use upload.single for image upload during category creation
router.post("/", upload.single("image"), createCategory); // ✅ Now handles image

router.get("/", getCategories);
// router.put("/:id", updateCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:categoryName/jobs", getJobsByCategory);

// test route 
router.get("/test", (req, res) => {
  res.send("Category test route works");
});

export default router;
