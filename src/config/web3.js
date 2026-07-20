const CHAINS = {
  421614: {
    hexChainId: "0x66eee",
    name: "Arbitrum Sepolia",
    rpcUrl:
      process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL ||
      "https://arbitrum-sepolia-rpc.publicnode.com",
    blockExplorer: "https://sepolia.arbiscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  42161: {
    hexChainId: "0xa4b1",
    name: "Arbitrum One",
    rpcUrl:
      process.env.REACT_APP_ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
};

export const TARGET_CHAIN_ID = Number(
  process.env.REACT_APP_CHAIN_ID || 421614,
);

export const CONTRACTS = {
  propertyToken:
    process.env.REACT_APP_RWA_PROPERTY_TOKEN_ADDRESS ||
    "0x741F37dcDcc40369e34240c60B10Ee8f0c789Cc2",
  marketplace:
    process.env.REACT_APP_RWA_MARKETPLACE_ADDRESS ||
    "0x98e28AB23A63Ea26AF47A6d077fb95BF25285777",
  defaultListingId: process.env.REACT_APP_DEFAULT_LISTING_ID || "0",
};

export const ONCHAIN_CHECKOUT_ENABLED =
  process.env.REACT_APP_ENABLE_ONCHAIN_CHECKOUT === "true";

export function getTargetChain() {
  return CHAINS[TARGET_CHAIN_ID] || CHAINS[421614];
}

export function isSupportedChain(chainId) {
  const normalized = normalizeChainId(chainId);
  const target = getTargetChain();
  return normalized === target.hexChainId.toLowerCase();
}

export function normalizeChainId(chainId) {
  if (chainId == null) return "";
  if (typeof chainId === "number") {
    return `0x${chainId.toString(16)}`;
  }
  const value = String(chainId).toLowerCase();
  if (value.startsWith("0x")) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : `0x${parsed.toString(16)}`;
}

export function getExplorerAddressUrl(address) {
  return `${getTargetChain().blockExplorer}/address/${address}`;
}

export function getExplorerTxUrl(txHash) {
  return `${getTargetChain().blockExplorer}/tx/${txHash}`;
}

export { CHAINS };
