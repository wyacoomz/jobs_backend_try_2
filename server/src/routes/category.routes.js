import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import * as catCtrl from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", catCtrl.getCategories);

router.use(protect); // admin only
router.post("/", upload.single("image"), catCtrl.createCategory);
router.put("/:id", upload.single("image"), catCtrl.updateCategory);
router.delete("/:id", catCtrl.deleteCategory);
router.post("/:id/sub", catCtrl.addSubCategory);
router.get("/:id/sub", catCtrl.getSubCategories);
router.delete("/:id/sub", catCtrl.removeSubCategory);

export default router;