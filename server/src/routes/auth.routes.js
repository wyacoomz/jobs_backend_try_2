import express from "express";
import { registerUser, registerRecruiter, loginWithPhone, logout, getCurrentUser, getCurrentRecruiter, login } from "../controllers/auth.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register/user",   upload.single("resume"), registerUser);
router.post("/register/recruiter", upload.single("logo"), registerRecruiter);
router.post("/login", login)
router.post("/login/user",      loginUser);
router.post("/login/recruiter", loginRecruiter);
router.post("/loginphone", loginWithPhone);
router.get("/logout", logout); 

router.get("/me", protect, getCurrentUser); // ✅ fetch current logged-in user
router.get("/ME", getCurrentRecruiter)
export default router;