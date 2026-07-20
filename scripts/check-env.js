/**
 * Quick env + connectivity sanity check.
 * Run: node scripts/check-env.js
 */
const fs = require("fs");
const path = require("path");

// Load config.env (same logic as server.js)
const envPath = fs.existsSync(path.join(__dirname, "..", "server", "config", "config.env"))
  ? path.join(__dirname, "..", "server", "config", "config.env")
  : path.join(__dirname, "..", ".env");

require("dotenv").config({ path: envPath });

// Also load root .env for REACT_APP_* keys
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), override: false });

const checks = [
  // Backend
  ["PORT",                            process.env.PORT],
  ["NODE_ENV",                        process.env.NODE_ENV],
  ["MONGO_URI",                       process.env.MONGO_URI ? "✅ set" : "❌ MISSING"],
  ["JWT_SECRET",                      process.env.JWT_SECRET ? "✅ set" : "❌ MISSING"],
  ["JWT_EXPIRE",                      process.env.JWT_EXPIRE],
  ["COOKIE_EXPIRE",                   process.env.COOKIE_EXPIRE],
  ["FRONTEND_URL",                    process.env.FRONTEND_URL],
  ["PINATA_JWT",                      process.env.PINATA_JWT ? "✅ set" : "❌ MISSING"],
  ["SEED_ADMIN_EMAIL",                process.env.SEED_ADMIN_EMAIL],
  // Hardhat / deploy
  ["DEPLOYER_PRIVATE_KEY",            process.env.DEPLOYER_PRIVATE_KEY ? "✅ set" : "❌ MISSING"],
  ["ARBITRUM_SEPOLIA_RPC_URL",        process.env.ARBITRUM_SEPOLIA_RPC_URL],
  ["ARBISCAN_API_KEY",                process.env.ARBISCAN_API_KEY ? "✅ set" : "❌ MISSING"],
  // Frontend Web3
  ["REACT_APP_CHAIN_ID",              process.env.REACT_APP_CHAIN_ID],
  ["REACT_APP_RWA_PROPERTY_TOKEN",    process.env.REACT_APP_RWA_PROPERTY_TOKEN_ADDRESS],
  ["REACT_APP_RWA_MARKETPLACE",       process.env.REACT_APP_RWA_MARKETPLACE_ADDRESS],
  ["REACT_APP_ARBITRUM_SEPOLIA_RPC",  process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL],
];

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log("║         Billion Towers — Environment Check              ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");
console.log(`  Config loaded from: ${envPath}\n`);

let allOk = true;
for (const [key, val] of checks) {
  const display = val || "❌ MISSING";
  if (!val) allOk = false;
  console.log(`  ${key.padEnd(36)} ${display}`);
}

console.log("\n" + (allOk ? "  ✅  All required env vars are set." : "  ⚠️   Some vars are missing — see above.") + "\n");
