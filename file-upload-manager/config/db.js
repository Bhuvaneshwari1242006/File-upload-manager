import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Use 127.0.0.1 to avoid IPv6/localhost issues
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/file_manager";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");

    // Log connection states for debugging
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose connection disconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    // Handle transient failures without crashing immediately
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;