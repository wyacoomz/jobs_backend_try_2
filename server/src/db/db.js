import mongoose from "mongoose";
import config from "../config/env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`db connect`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
