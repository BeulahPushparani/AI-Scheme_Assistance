import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });
}