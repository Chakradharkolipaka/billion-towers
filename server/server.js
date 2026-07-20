const fs = require("fs");
const path = require("path");
const http = require("http");

// Increase header size limit for large cookies/tokens (320KB)
// This prevents 431 errors from MetaMask and other extensions
http.maxHeaderSize = 327680;

const envPath = fs.existsSync(path.join(__dirname, "config", "config.env"))
  ? path.join(__dirname, "config", "config.env")
  : path.join(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

console.log("[server] ENV loaded from:", envPath);
console.log("[server] HTTP max header size set to:", http.maxHeaderSize, "bytes (320KB)");

const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

const PORT = process.env.PORT || 3099;

process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function startServer() {
  console.log("[server] Validating environment...");
  
  if (!process.env.MONGO_URI) {
    console.error("[server] ❌ MONGO_URI is required. Set it in server/config/config.env");
    process.exit(1);
  }
  console.log("[server] ✅ MONGO_URI found");

  if (!process.env.JWT_SECRET) {
    console.error("[server] ❌ JWT_SECRET is required. Set it in server/config/config.env");
    process.exit(1);
  }
  console.log("[server] ✅ JWT_SECRET found");

  console.log("[server] Connecting to database...");
  await connectDatabase();
  console.log("[server] ✅ Database ready");

  // Create HTTP server with increased header size
  const server = http.createServer(app);
  server.maxHeaderSize = 327680; // 320KB
  
  server.listen(PORT, () => {
    console.log(`[server] ✅ Server running on http://localhost:${PORT}`);
    console.log(`[server] ✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`[server] ✅ Max header size: ${server.maxHeaderSize} bytes`);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`[server] ❌ Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
