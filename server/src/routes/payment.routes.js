import express from 'express';
import { protect } from "../middleware/auth.middleware.js";
import * as payCtrl from "../controllers/payment.controller.js";

const router = express.Router();


router.post("/create-wallet-order" , protect, payCtrl.createWalletOrder);
router.post("/verify-wallet-payment", protect, payCtrl.verifyWalletPayment);
router.get("/wallet", protect, payCtrl.wallet);
router.post("/view-mobile/:jobId", protect, payCtrl.viewCandidateMobile);

export default router;
