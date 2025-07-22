import express from "express";
import { protect } from "../middleware/auth.middleware.js"; // Ensure adminOnly is defined to check for admin role
import { upload } from "../middleware/upload.middleware.js";
import * as catCtrl from "../controllers/category.controller.js";


const router = express.Router();

// Public endpoint to get all categories
router.get("/", catCtrl.getCategories);

// Protected routes (Admin Only)
router.use(protect); // Use protect middleware to ensure user is logged in

// Admin can create a new category with an image
router.post("/", upload.single("image"), catCtrl.createCategory);

// Admin can update an existing category with an image
router.put("/:id", upload.single("image"), catCtrl.updateCategory);

// Admin can delete a category
router.delete("/:id", catCtrl.deleteCategory);

// Admin can add a subcategory to an existing category
router.post("/:id/sub", catCtrl.addSubCategory);

// Get subcategories of a specific category
router.get("/:id/sub", catCtrl.getSubCategories);

// Admin can remove a subcategory from a category
router.delete("/:id/sub", catCtrl.removeSubCategory);

export default router;