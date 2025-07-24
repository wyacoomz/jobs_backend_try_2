// src/middleware/admin.middleware.js
export default (req, res, next) => {
  if (req.account?.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
};