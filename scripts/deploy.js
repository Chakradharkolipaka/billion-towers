const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const tokenFactory = await hre.ethers.getContractFactory("RWAPropertyToken");
  const token = await tokenFactory.deploy(
    "Billion Towers Property Token",
    "BTPT",
    "PROP-0001",
    "Arbitrum Real Estate Asset",
    1_000_000,
    hre.ethers.utils.parseUnits("1000000", 18),
    deployer.address,
  );
  await token.deployed();
  console.log("RWAPropertyToken deployed to:", token.address);

  const marketplaceFactory =
    await hre.ethers.getContractFactory("RWAMarketplace");
  const marketplace = await marketplaceFactory.deploy();
  await marketplace.deployed();
  console.log("RWAMarketplace deployed to:", marketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
