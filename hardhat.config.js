const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("@nomicfoundation/hardhat-toolbox");

const ARBITRUM_RPC_URL =
  process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc";
const ARBITRUM_SEPOLIA_RPC_URL =
  process.env.ARBITRUM_SEPOLIA_RPC_URL ||
  "https://arbitrum-sepolia-rpc.publicnode.com";

function normalizePrivateKey(key) {
  if (!key || key.includes("your_wallet_private_key")) {
    return "";
  }
  return key.startsWith("0x") ? key : `0x${key}`;
}

const PRIVATE_KEY = normalizePrivateKey(process.env.DEPLOYER_PRIVATE_KEY);

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 421614,
      timeout: 120_000,
    },
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
    },
  },
};
