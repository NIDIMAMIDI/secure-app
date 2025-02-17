import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database has been connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
