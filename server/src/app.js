import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes      from "./routes/auth.routes.js";
import userRoutes      from "./routes/user.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import categoryRoutes  from "./routes/category.routes.js";
import jobRoutes from "./routes/job.routes.js"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound }     from "./middleware/notFound.middleware.js";
import subCategoryRoutes from "./routes/subcategory.routes.js"; 
// import paymentRoutes from "./routes/payment.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import adminRoutes from "./routes/admin.routes.js";
dotenv.config();
const app = express();



app.use(cors({
  origin: "http://localhost:5173", // update with your frontend URL if needed
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

}));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/user",     userRoutes);
app.use("/api/recruiter",recruiterRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/job", jobRoutes)
app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/payment", paymentRoutes);
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`)))
  .catch(console.error);

  export default app;