import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Connection Error:", error);
  }
}
