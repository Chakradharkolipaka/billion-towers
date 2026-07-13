require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const ARBITRUM_RPC_URL =
  process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc";
const ARBITRUM_GOERLI_RPC_URL =
  process.env.ARBITRUM_GOERLI_RPC_URL ||
  "https://goerli-rollup.arbitrum.io/rpc";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    arbitrumGoerli: {
      url: ARBITRUM_GOERLI_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumGoerli: process.env.ARBISCAN_API_KEY || "",
    },
  },
};
