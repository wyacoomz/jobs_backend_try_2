import express from "express";
import { getUserById, countActiveUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUserById);
router.get("/", countActiveUsers);

export default router;