import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as payCtrl from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/add-money", protect, payCtrl.addMoney);        // top-up wallet
router.post("/post-job",  protect, payCtrl.postJob);         // spend ₹100
router.get("/wallet",     protect, payCtrl.wallet);          // balance
router.post("/contacted", protect, payCtrl.markContacted);   // mark job done

export default router;