// src/controllers/category.controller.js
import Category from "../models/Category.js";
import Jobs from "../models/Jobs.js";
import cloudinary from "../config/cloudinary.js"; // adjust path as needed




// create category with image
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    const category = await Category.create({
      name,
      image: uploadResult.secure_url,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const update = { name: req.body.name };

    // If a new image is uploaded, upload to Cloudinary and update image field
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      update.image = uploadResult.secure_url;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  get jobs by category

// export const getJobsByCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.params; // get the category name from the url parameter 

//     // query jobs by category name 
//     const jobs = await Jobs.find({ category: categoryName }).exec();

//     if (jobs.length === 0) {
//       return res.status(404).json({ error: " No jobs found for this  category" });
//   }
//   res.status(200).json(Jobs);
//     } catch (err) {
//   res.status(500).json({ error: err.message });
//   }
// };


// export const getJobsByCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.params;

//     const jobs = await Jobs.find({
//       category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
//     }).exec();

//     if (jobs.length === 0) {
//       return res.status(404).json({ error: "No jobs found for this category" });
//     }

//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getJobsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // First, find category by name
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Then, find jobs by category _id
    const jobs = await Jobs.find({ category: category._id });

    if (!jobs.length ===0) {
      return res.status(404).json({ error: 'No jobs found for this category' });
    }

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};