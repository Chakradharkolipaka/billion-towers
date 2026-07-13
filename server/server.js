const fs = require("fs");
const path = require("path");
const envPath = fs.existsSync(path.join(__dirname, "config", "config.env"))
  ? path.join(__dirname, "config", "config.env")
  : path.join(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });
const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 3099;

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

if (process.env.MONGO_URI) {
  connectDatabase();
} else {
  // console.warn(
  //   "Skipping database startup because MONGO_URI is not configured.",
  // );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
