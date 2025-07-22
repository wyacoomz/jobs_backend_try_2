// src/models/Category.js
import mongoose from "mongoose";
import SubCategory from "./SubCategory.js"; // Import the new SubCategory model

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }], // Update this line
    image: { type: String } // base64 URL
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);