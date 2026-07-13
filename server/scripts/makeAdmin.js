/**
 * Promote an existing user to admin by email.
 *
 * Usage:
 *   node server/scripts/makeAdmin.js you@example.com
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const envPath = fs.existsSync(path.join(__dirname, "..", "config", "config.env"))
  ? path.join(__dirname, "..", "config", "config.env")
  : path.join(__dirname, "..", "..", ".env");

require("dotenv").config({ path: envPath });

const User = require("../models/userModel");

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: node server/scripts/makeAdmin.js <email>");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not configured.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true },
  );

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  console.log(`Updated ${user.email} to role: ${user.role}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
