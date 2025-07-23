// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, role }

    let account;
    switch (decoded.role) {
      case "user":
        account = await User.findById(decoded.id).select("-password");
        break;
      case "recruiter":
        account = await Recruiter.findById(decoded.id).select("-password");
        break;
      default:
        return res.status(401).json({ error: "Invalid role" });
    }

    if (!account) return res.status(401).json({ error: "Account not found" });

    req.account = account;          // generic key
    next();
  } catch {
    res.status(401).json({ error: "Token failed" });
  }
};