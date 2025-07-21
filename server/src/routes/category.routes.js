import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as catCtrl from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", catCtrl.getCategories);           // public read

router.use(protect);                              // ↓ admin only
router.post("/",           catCtrl.createCategory);
router.put("/:id",        catCtrl.updateCategory);
router.delete("/:id",     catCtrl.deleteCategory);

export default router;