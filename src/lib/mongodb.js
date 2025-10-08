import mongoose from "mongoose";

const mongoUrl = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(mongoUrl);
  } catch (error) {
    throw new Error("Database connection failed");
  }
};

export default connectDB;
