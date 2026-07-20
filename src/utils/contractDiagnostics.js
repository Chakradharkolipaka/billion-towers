/**
 * Contract diagnostics utility
 * Call this to check contract configuration
 */

import { BrowserProvider } from "ethers";
import { CONTRACTS, TARGET_CHAIN_ID } from "../config/web3";

export async function diagnoseContracts() {
  console.log("=== Contract Diagnostics ===\n");

  // Check configuration
  console.log("Configuration:");
  console.log("  Target Chain ID:", TARGET_CHAIN_ID);
  console.log("  Marketplace Address:", CONTRACTS.marketplace);
  console.log("  Token Address:", CONTRACTS.propertyToken);

  if (!window.ethereum) {
    console.error("❌ No Web3 wallet detected");
    return;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    console.log("\nConnected Network:");
    console.log("  Chain ID:", chainId);
    console.log("  Network Name:", network.name);

    // Check if on correct network
    if (chainId !== TARGET_CHAIN_ID) {
      console.error(
        `❌ Wrong network! Expected ${TARGET_CHAIN_ID}, got ${chainId}`
      );
      console.log("   Please switch to Arbitrum Sepolia in MetaMask");
      return;
    }

    console.log("✅ Correct network");

    // Check if contract exists
    const marketplaceCode = await provider.getCode(CONTRACTS.marketplace);
    const tokenCode = await provider.getCode(CONTRACTS.propertyToken);

    console.log("\nContract Verification:");
    console.log(
      "  Marketplace code length:",
      marketplaceCode.length,
      marketplaceCode === "0x" ? "❌ NOT DEPLOYED" : "✅ Deployed"
    );
    console.log(
      "  Token code length:",
      tokenCode.length,
      tokenCode === "0x" ? "❌ NOT DEPLOYED" : "✅ Deployed"
    );

    if (marketplaceCode === "0x") {
      console.error(
        "\n❌ Marketplace contract not found at:",
        CONTRACTS.marketplace
      );
      console.log("   Either:");
      console.log("   1. Wrong contract address in .env");
      console.log("   2. Contract not deployed to Arbitrum Sepolia");
      console.log("   3. Wrong network selected");
    }

    if (tokenCode === "0x") {
      console.error("\n❌ Token contract not found at:", CONTRACTS.propertyToken);
    }

    if (marketplaceCode !== "0x" && tokenCode !== "0x") {
      console.log("\n✅ All contracts found!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Auto-run on import (for debugging)
if (process.env.NODE_ENV === "development") {
  setTimeout(() => {
    if (window.ethereum) {
      diagnoseContracts();
    }
  }, 1000);
}
