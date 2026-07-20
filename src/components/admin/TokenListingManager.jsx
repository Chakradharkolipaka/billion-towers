import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useWallet } from "../../context/WalletContext";
import { getMarketplaceContract, getPropertyTokenContract } from "../../utils/contracts";
import { parseUnits, formatUnits } from "ethers";

const TokenListingManager = ({ product, onUpdate }) => {
  const { wallet, isConnected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("not_listed");
  const [listingDetails, setListingDetails] = useState(null);

  useEffect(() => {
    if (product?.blockchainListing?.listed) {
      setStatus("listed");
      setListingDetails(product.blockchainListing);
    } else if (product?.blockchainListing?.tokensMinted > 0) {
      setStatus("minted");
      setListingDetails(product.blockchainListing);
    } else {
      setStatus("not_listed");
    }
  }, [product]);

  const mintAndListTokens = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      await connect();
      return;
    }

    setLoading(true);
    const toastId = "mint-list";
    
    try {
      toast.loading("Step 1/5: Getting contracts...", { id: toastId });
      
      const token = await getPropertyTokenContract();
      const marketplace = await getMarketplaceContract();
      const tokenAddress = await token.getAddress();
      const marketplaceAddress = await marketplace.getAddress();
      const provider = marketplace.runner.provider;
      
      // Helper function to get fresh gas params with buffer
      const getGasParams = async () => {
        const feeData = await provider.getFeeData();
        // Use 150% buffer to handle rapid base fee changes on Arbitrum
        return {
          maxFeePerGas: (feeData.maxFeePerGas * 150n) / 100n,
          maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 150n) / 100n,
        };
      };

      // Calculate shares to mint (from product stock)
      const sharesToMint = product.stock || product.totalShares || 1000;
      
      toast.loading(`Step 2/5: Minting ${sharesToMint} tokens...`, { id: toastId });
      
      // 1. Mint tokens to admin wallet (with fresh gas estimation)
      const mintTx = await token.mint(wallet.address, sharesToMint, await getGasParams());
      await mintTx.wait();
      
      toast.loading("Step 3/5: Approving marketplace...", { id: toastId });
      
      // 2. Approve marketplace to transfer tokens (with fresh gas estimation)
      const approveTx = await token.approve(marketplaceAddress, sharesToMint, await getGasParams());
      await approveTx.wait();
      
      toast.loading("Step 4/5: Listing on marketplace...", { id: toastId });
      
      // 3. Get current minimum price from marketplace
      const minimumPricePerUnit = await marketplace.s_minimumPricePerUnit();
      
      console.log("Minimum price per unit from contract:", minimumPricePerUnit.toString());
      
      // 4. Calculate price per unit in ETH (convert from USD)
      // Using a simple conversion: $1 = 0.001 ETH (adjust as needed)
      const priceInUSD = product.price;
      const pricePerShareUSD = priceInUSD / (product.totalShares || 1000);
      const pricePerShareETH = pricePerShareUSD * 0.001; // Simple conversion
      let pricePerUnitWei = parseUnits(pricePerShareETH.toFixed(18), 18);
      
      // Ensure price meets minimum requirement
      if (pricePerUnitWei < minimumPricePerUnit) {
        console.log("Calculated price too low, using minimum:", minimumPricePerUnit.toString());
        pricePerUnitWei = minimumPricePerUnit;
        toast.loading(`Adjusting price to meet minimum (${formatUnits(minimumPricePerUnit, 18)} ETH/token)...`, { id: toastId });
      }
      
      console.log("Final price per unit:", pricePerUnitWei.toString());
      
      // 5. List tokens on marketplace (with fresh gas estimation)
      const listTx = await marketplace.listForSale(
        tokenAddress,
        sharesToMint,
        pricePerUnitWei,
        await getGasParams()
      );
      
      const receipt = await listTx.wait();
      
      toast.loading("Step 5/5: Extracting listing ID...", { id: toastId });
      
      // 5. Extract listingId from events
      let listingId = null;
      
      // Try to parse events from the receipt
      if (receipt.logs && receipt.logs.length > 0) {
        for (const log of receipt.logs) {
          try {
            // Check if this log is from the marketplace contract
            if (log.address.toLowerCase() === marketplaceAddress.toLowerCase()) {
              const parsed = marketplace.interface.parseLog({
                topics: log.topics,
                data: log.data
              });
              
              console.log("Parsed event:", parsed);
              
              if (parsed && parsed.name === "PropertyListed") {
                listingId = Number(parsed.args.listingId);
                console.log("Found listing ID:", listingId);
                break;
              }
            }
          } catch (e) {
            // Skip logs that can't be parsed
            console.log("Could not parse log:", e.message);
            continue;
          }
        }
      }
      
      // Fallback: get the next listing ID from contract state
      if (!listingId && listingId !== 0) {
        console.log("Event parsing failed, getting listing ID from contract state...");
        const nextListingId = await marketplace.s_nextListingId();
        // The listing we just created should be nextListingId - 1
        listingId = Number(nextListingId) - 1;
        console.log("Using fallback listing ID:", listingId);
      }
      
      if (listingId === null || listingId < 0) {
        throw new Error("Could not determine listing ID. Transaction succeeded but listing ID is unknown.");
      }
      
      toast.loading("Saving to database...", { id: toastId });
      
      // 6. Store blockchain listing data in database
      const blockchainData = {
        listingId: Number(listingId),
        tokenAddress,
        tokensMinted: sharesToMint,
        tokensListed: sharesToMint,
        seller: wallet.address,
        pricePerUnit: pricePerUnitWei.toString(),
        listed: true,
        listedAt: new Date().toISOString(),
        transactionHash: receipt.hash,
      };
      
      // Update product with blockchain data
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${apiUrl}/api/product/admin/product/${product._id}/blockchain`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ blockchainListing: blockchainData }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn("API update failed:", response.status, errorData);
          throw new Error(`API returned ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Successfully updated database:", result);
        
        toast.success(
          `Property tokenized! Listing ID: ${listingId}`,
          { id: toastId, duration: 5000 }
        );
        
      } catch (apiError) {
        console.error("Database sync failed:", apiError);
        
        // Store in localStorage as fallback
        const storageKey = `blockchain_listing_${product._id}`;
        localStorage.setItem(storageKey, JSON.stringify(blockchainData));
        
        toast.success(
          `Tokens listed (Listing ID: ${listingId}) but database sync failed. Data stored locally.`,
          { id: toastId, duration: 6000 }
        );
      }
      
      if (onUpdate) onUpdate();
      
    } catch (error) {
      console.error("Failed to mint and list:", error);
      
      let errorMessage = "Failed to list tokens";
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction cancelled";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH for gas fees";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const refreshListingInfo = async () => {
    if (!listingDetails?.listingId) return;
    
    setLoading(true);
    try {
      const marketplace = await getMarketplaceContract();
      const listing = await marketplace.listings(listingDetails.listingId);
      
      // Update with current on-chain data
      const currentAmount = Number(listing.amount);
      
      if (currentAmount === 0) {
        toast.info("All tokens sold!");
      }
      
      setListingDetails(prev => ({
        ...prev,
        tokensListed: currentAmount,
      }));
      
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast.error("Failed to refresh listing info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.08] bg-brand-bg-panel/60 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-brand-gold" />
          <h3 className="text-sm font-semibold text-white">Blockchain Listing</h3>
        </div>
        
        {status === "listed" && (
          <button
            onClick={refreshListingInfo}
            disabled={loading}
            className="rounded-lg p-1.5 text-brand-ink-secondary hover:bg-white/5 hover:text-white disabled:opacity-50"
            title="Refresh listing info"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {status === "not_listed" && (
        <div className="space-y-3">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-medium text-amber-100">Not Listed on Blockchain</p>
                <p className="mt-1 text-xs text-amber-200/70">
                  This property needs to be tokenized and listed before users can invest with real ETH.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={mintAndListTokens}
            disabled={loading || !isConnected}
            className="w-full rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-ink-darker transition-all hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Mint & List Tokens"
            )}
          </button>
          
          {!isConnected && (
            <p className="text-xs text-center text-brand-ink-muted">
              Connect wallet as contract owner to list
            </p>
          )}
        </div>
      )}

      {status === "minted" && (
        <div className="space-y-2">
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-blue-100">Tokens Minted</p>
                <p className="mt-1 text-xs text-blue-200/70">
                  {listingDetails.tokensMinted} tokens minted. Complete listing process.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "listed" && listingDetails && (
        <div className="space-y-2">
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-green-100">Listed on Blockchain ✓</p>
                <div className="mt-2 space-y-1 text-xs text-green-200/70">
                  <div className="flex justify-between">
                    <span>Listing ID:</span>
                    <span className="font-mono font-semibold text-white">#{listingDetails.listingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens Available:</span>
                    <span className="font-semibold text-white">
                      {listingDetails.tokensListed || listingDetails.tokensMinted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price/Token:</span>
                    <span className="font-semibold text-white">
                      {formatUnits(listingDetails.pricePerUnit, 18)} ETH
                    </span>
                  </div>
                </div>
                
                {listingDetails.transactionHash && (
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${listingDetails.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-brand-cyan hover:text-brand-cyan-light"
                  >
                    View on Arbiscan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TokenListingManager;
