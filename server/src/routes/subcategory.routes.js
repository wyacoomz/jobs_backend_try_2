import express from "express";
import { protect,  } from "../middleware/auth.middleware.js";
import * as subCtrl from "../controllers/SubCategoryController.js";

const router = express.Router();

router.post("/", protect,  subCtrl.createSubCategory);
router.get("/", subCtrl.getSubCategories);
router.put("/:id", protect,  subCtrl.updateSubCategory);
router.delete("/:id", protect, subCtrl.deleteSubcategory);

export default router;