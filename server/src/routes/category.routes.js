// src/routes/category.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as catCtrl from "../controllers/category.controller.js";
import * as subCatCtrl from "../controllers/subCategory.controller.js";
const router = express.Router();

router.get("/", catCtrl.getCategories);
router.post("/", protect, catCtrl.createCategory);
router.put("/:id", protect, catCtrl.updateCategory);
router.delete("/:id", protect, catCtrl.deleteCategory);
router.post("/:id/sub", protect, subCatCtrl.addSubCategory);
router.delete("/:id/sub", protect, subCatCtrl.removeSubCategory);
router.get("/:id/sub", subCatCtrl.getSubCategoriesByCategory);

export default router;