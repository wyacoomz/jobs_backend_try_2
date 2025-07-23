import express from "express";

import * as subCtrl from "../controllers/subCategory.controller.js";

const router = express.Router();

router.post("/",  subCtrl.createSubCategory);
router.get("/", subCtrl.getSubCategories);
router.put("/:id",  subCtrl.updateSubCategory);
router.delete("/:id", subCtrl.deleteSubcategory);

export default router;