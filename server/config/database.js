const mongoose = require("mongoose");
const seedDatabase = require("./seedDatabase");

const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set.");
  }

  console.log("[database] Connecting to MongoDB...");
  
  // Set TLS options for WSL/Windows compatibility
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log("[database] ✅ Connected to:", mongoose.connection.name);

    console.log("[database] Running seed script...");
    await seedDatabase();
    console.log("[database] ✅ Seed complete");
  } catch (error) {
    console.error("[database] ❌ Connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDatabase;
