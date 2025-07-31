import express from "express";
import { getUserById, countActiveUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", countActiveUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;