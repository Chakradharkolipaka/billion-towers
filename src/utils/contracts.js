import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import marketplaceAbi from "../abis/RWAMarketplace.json";
import tokenAbi from "../abis/RWAPropertyToken.json";
import { CONTRACTS, getExplorerTxUrl } from "../config/web3";
import { hasWalletProvider } from "./wallet";

export function getBrowserProvider() {
  if (!hasWalletProvider()) {
    throw new Error("No Web3 wallet detected.");
  }
  return new BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getBrowserProvider();
  return provider.getSigner();
}

export async function getMarketplaceContract(runner) {
  const signerOrProvider = runner || (await getSigner());
  return new Contract(CONTRACTS.marketplace, marketplaceAbi, signerOrProvider);
}

export async function getPropertyTokenContract(runner) {
  const signerOrProvider = runner || (await getSigner());
  return new Contract(CONTRACTS.propertyToken, tokenAbi, signerOrProvider);
}

export async function readMarketplaceState() {
  try {
    const provider = getBrowserProvider();
    const marketplace = await getMarketplaceContract(provider);

    // Check if contract exists
    const code = await provider.getCode(CONTRACTS.marketplace);
    if (code === "0x") {
      console.warn("Marketplace contract not deployed at:", CONTRACTS.marketplace);
      // Return mock data for UI testing
      return {
        isActive: false,
        minimumPricePerUnit: 0n,
        minimumPriceEth: "0",
        nextListingId: "0",
        contractNotDeployed: true,
      };
    }

    const [isActive, minimumPricePerUnit, nextListingId] = await Promise.all([
      marketplace.s_isActive(),
      marketplace.s_minimumPricePerUnit(),
      marketplace.s_nextListingId(),
    ]);

    return {
      isActive,
      minimumPricePerUnit,
      minimumPriceEth: formatUnits(minimumPricePerUnit, 18),
      nextListingId: nextListingId.toString(),
      contractNotDeployed: false,
    };
  } catch (error) {
    console.error("Error reading marketplace state:", error);
    // Return mock data if contract call fails
    return {
      isActive: false,
      minimumPricePerUnit: 0n,
      minimumPriceEth: "0",
      nextListingId: "0",
      contractNotDeployed: true,
      error: error.message,
    };
  }
}

export async function readListing(listingId) {
  const provider = getBrowserProvider();
  const marketplace = await getMarketplaceContract(provider);
  const listing = await marketplace.listings(listingId);

  return {
    seller: listing.seller,
    token: listing.token,
    amount: listing.amount,
    amountFormatted: formatUnits(listing.amount, 18),
    pricePerUnit: listing.pricePerUnit,
    pricePerUnitEth: formatUnits(listing.pricePerUnit, 18),
    active: listing.active,
  };
}

export async function readTokenBalance(address) {
  const provider = getBrowserProvider();
  const token = await getPropertyTokenContract(provider);
  const balance = await token.balanceOf(address);
  return {
    raw: balance,
    formatted: formatUnits(balance, 18),
  };
}

export async function purchaseListing({ listingId, tokenAmount }) {
  const marketplace = await getMarketplaceContract();
  const listing = await readListing(listingId);

  if (!listing.active) {
    throw new Error(`Listing #${listingId} is not active.`);
  }

  const amount = parseUnits(String(tokenAmount), 18);
  if (amount > listing.amount) {
    throw new Error("Purchase amount exceeds listing availability.");
  }

  const totalWei = amount * listing.pricePerUnit;
  
  // Get fresh gas params with 150% buffer for Arbitrum
  const provider = marketplace.runner.provider;
  const feeData = await provider.getFeeData();
  const gasParams = {
    maxFeePerGas: (feeData.maxFeePerGas * 150n) / 100n,
    maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 150n) / 100n,
  };
  
  const tx = await marketplace.purchase(listingId, amount, { 
    value: totalWei,
    ...gasParams
  });
  await tx.wait();

  return {
    hash: tx.hash,
    explorerUrl: getExplorerTxUrl(tx.hash),
    totalEth: formatUnits(totalWei, 18),
  };
}

export async function listTokensForSale({ tokenAmount, pricePerUnitEth }) {
  const signer = await getSigner();
  const token = await getPropertyTokenContract(signer);
  const marketplace = await getMarketplaceContract(signer);
  const amount = parseUnits(String(tokenAmount), 18);
  const pricePerUnit = parseUnits(String(pricePerUnitEth), 18);

  // Helper function for gas params
  const getGasParams = async () => {
    const provider = marketplace.runner.provider;
    const feeData = await provider.getFeeData();
    return {
      maxFeePerGas: (feeData.maxFeePerGas * 150n) / 100n,
      maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 150n) / 100n,
    };
  };

  const allowance = await token.allowance(
    await signer.getAddress(),
    CONTRACTS.marketplace,
  );

  if (allowance < amount) {
    const approveTx = await token.approve(CONTRACTS.marketplace, amount, await getGasParams());
    await approveTx.wait();
  }

  const tx = await marketplace.listForSale(
    CONTRACTS.propertyToken,
    amount,
    pricePerUnit,
    await getGasParams()
  );
  await tx.wait();

  return {
    hash: tx.hash,
    explorerUrl: getExplorerTxUrl(tx.hash),
  };
}
