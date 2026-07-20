const hre = require("hardhat");

const TOKEN_ADDRESS =
  process.env.REACT_APP_RWA_PROPERTY_TOKEN_ADDRESS ||
  "0x741F37dcDcc40369e34240c60B10Ee8f0c789Cc2";
const MARKETPLACE_ADDRESS =
  process.env.REACT_APP_RWA_MARKETPLACE_ADDRESS ||
  "0x98e28AB23A63Ea26AF47A6d077fb95BF25285777";
const MIN_PRICE_WEI = "1000000000000000"; // 0.001 ETH

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("Set DEPLOYER_PRIVATE_KEY in .env before verifying.");
  }

  console.log("Verifying with deployer:", deployer.address);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("Marketplace:", MARKETPLACE_ADDRESS);

  try {
    await hre.run("verify:verify", {
      address: TOKEN_ADDRESS,
      constructorArguments: [
        "Billion Towers Property Token",
        "BTPT",
        "PROP-0001",
        "Arbitrum Real Estate Asset",
        1_000_000n,
        hre.ethers.parseUnits("1000000", 18),
        deployer.address,
      ],
    });
    console.log("RWAPropertyToken verified.");
  } catch (error) {
    console.error("Token verification failed:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: MARKETPLACE_ADDRESS,
      constructorArguments: [MIN_PRICE_WEI],
    });
    console.log("RWAMarketplace verified.");
  } catch (error) {
    console.error("Marketplace verification failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
