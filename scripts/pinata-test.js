/**
 * Pinata connectivity smoke-test.
 * Run: npm run pinata:test
 *
 * Pins a tiny JSON document to IPFS via the Pinata API and prints the
 * resulting CID + gateway URL. Exits non-zero if the call fails.
 *
 * Reads PINATA_JWT from: server/config/config.env  →  .env  (same resolution
 * order as the backend server).
 *
 * No file is written to disk. The pinned content is just a timestamp + label
 * so running it multiple times is harmless (Pinata deduplicates by CID anyway).
 */
"use strict";

const fs   = require("fs");
const path = require("path");

// ── Load env (same resolution as server.js) ──────────────────────────────────
const configEnvPath = path.join(__dirname, "..", "server", "config", "config.env");
const rootEnvPath   = path.join(__dirname, "..", ".env");
const envFile       = fs.existsSync(configEnvPath) ? configEnvPath : rootEnvPath;
require("dotenv").config({ path: envFile });

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
  console.error("❌  PINATA_JWT is not set. Add it to server/config/config.env or .env");
  process.exit(1);
}

// ── Pin a minimal JSON document ───────────────────────────────────────────────
async function main() {
  console.log("\n🔌  Pinata smoke-test starting …");
  console.log(`   Config file : ${envFile}`);
  console.log(`   PINATA_JWT  : ${PINATA_JWT.slice(0, 20)}…\n`);

  const payload = {
    pinataContent: {
      app:       "billion-towers",
      purpose:   "smoke-test",
      timestamp: new Date().toISOString(),
    },
    pinataMetadata: {
      name: `billion-towers-smoke-test-${Date.now()}`,
    },
  };

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("❌  Pinata API error:", result.error || result.message || JSON.stringify(result));
    process.exit(1);
  }

  const cid        = result.IpfsHash;
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  console.log("✅  Pinata upload succeeded!");
  console.log(`   CID         : ${cid}`);
  console.log(`   Gateway URL : ${gatewayUrl}\n`);
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err.message);
  process.exit(1);
});
