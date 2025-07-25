import express from "express";
import { registerUser, registerRecruiter, loginWithPhone, loginUser, loginRecruiter, logout } from "../controllers/auth.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register/user",   upload.single("resume"), registerUser);
router.post("/register/recruiter", upload.single("logo"), registerRecruiter);
router.post("/login/user",      loginUser);
router.post("/login/recruiter", loginRecruiter);
router.post("/loginphone", loginWithPhone);
router.get("/logout", logout); 

export default router;