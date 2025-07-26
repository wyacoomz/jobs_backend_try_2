// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import Recruiter from "../models/Recruiter.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token = null;

//     // Try cookie first
//     if (req.cookies && req.cookies.token) {
//       token = req.cookies.token;
//     }

//     // Fallback to Authorization header
//     if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({ error: "Not authorized. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, role }

//     let account;
//     switch (decoded.role) {
//       case "user":
//         account = await User.findById(decoded.id).select("-password");
//         if (!account) return res.status(401).json({ error: "User not found" });
//         req.user = account;
//         break;

//       case "recruiter":
//         account = await Recruiter.findById(decoded.id).select("-password");
//         if (!account) return res.status(401).json({ error: "Recruiter not found" });
//         req.recruiter = account;
//         break;

//       default:
//         return res.status(403).json({ error: "Invalid role" });
//     }

//     req.account = account; // generic access
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };


// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, role }

    let account;
    switch (decoded.role) {
      case "user":
      case "admin":
        account = await User.findById(decoded.id).select("-password");
        break;
      case "recruiter":
        account = await Recruiter.findById(decoded.id).select("-password");
        break;
      default:
        return res.status(403).json({ error: "Invalid role" });
    }

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    req.user = account;          // ✅ unified access
    req.account = account;       // optional alias
    req.role = decoded.role;     // ✅ useful for RBAC
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

