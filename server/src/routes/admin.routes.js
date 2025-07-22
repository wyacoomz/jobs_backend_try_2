import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middelware.js";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js"


const router = express.Router();
router.use(protect, isAdmin);
//everything below is admin-only

//GET /api/admin/users -> all users 


router.get("/users", async (_req, res, next) =>{
    try{
        const user = await User.find({}).select("-password");
        res.json(users);
    } catch (err) { next(err)}
});

//GET /api/admin/re