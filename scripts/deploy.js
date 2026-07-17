const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    throw new Error(
      "No deployer account configured. Add DEPLOYER_PRIVATE_KEY to .env " +
        "(MetaMask → account menu → Account details → Show private key), " +
        "save the file, then retry.",
    );
  }

  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);
  console.log("RPC URL:", hre.network.config.url);

  try {
    const network = await hre.ethers.provider.getNetwork();
    console.log("Connected to chain ID:", network.chainId.toString());
  } catch (err) {
    throw new Error(
      `Cannot reach Arbitrum Sepolia RPC (${hre.network.config.url}). ` +
        "This is usually a WSL2/firewall/network issue (ETIMEDOUT).\n\n" +
        "Try one of these in .env:\n" +
        "  ARBITRUM_SEPOLIA_RPC_URL=https://arbitrum-sepolia-rpc.publicnode.com\n" +
        "  ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/YOUR_KEY\n" +
        "  ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc\n\n" +
        `Original error: ${err.message}`,
    );
  }

  const tokenFactory = await hre.ethers.getContractFactory("RWAPropertyToken");
  const token = await tokenFactory.deploy(
    "Billion Towers Property Token",
    "BTPT",
    "PROP-0001",
    "Arbitrum Real Estate Asset",
    1_000_000n,
    hre.ethers.parseUnits("1000000", 18),
    deployer.address,
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("RWAPropertyToken deployed to:", tokenAddress);

  const minPricePerUnit = hre.ethers.parseUnits("0.001", 18);
  const marketplaceFactory =
    await hre.ethers.getContractFactory("RWAMarketplace");
  const marketplace = await marketplaceFactory.deploy(minPricePerUnit);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("RWAMarketplace deployed to:", marketplaceAddress);
  console.log(
    "Minimum price per unit:",
    hre.ethers.formatUnits(minPricePerUnit, 18),
    "ETH",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
