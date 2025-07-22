import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true },
    subCategories: [String],
    iamge: { type: String} // based64 URL
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);