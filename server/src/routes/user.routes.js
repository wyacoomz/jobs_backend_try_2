import express from "express";
import { getUserById, countActiveUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", countActiveUsers);
router.get("/:id", getUserById);


export default router;