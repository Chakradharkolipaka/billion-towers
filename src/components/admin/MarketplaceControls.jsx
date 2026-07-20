import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Power, DollarSign, RefreshCw, AlertCircle, CheckCircle, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useWallet } from "../../context/WalletContext";
import { getMarketplaceContract } from "../../utils/contracts";
import { formatUnits, parseUnits } from "ethers";

const MarketplaceControls = () => {
  const { wallet, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [marketplaceState, setMarketplaceState] = useState(null);
  const [newMinPrice, setNewMinPrice] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [contractBalance, setContractBalance] = useState("0");
  const [withdrawAddress, setWithdrawAddress] = useState("");

  const loadMarketplaceState = async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      const marketplace = await getMarketplaceContract();
      const provider = await marketplace.runner.provider;
      
      const [isActive, minimumPrice, owner, balance] = await Promise.all([
        marketplace.s_isActive(),
        marketplace.s_minimumPricePerUnit(),
        marketplace.owner(),
        provider.getBalance(await marketplace.getAddress()),
      ]);

      setMarketplaceState({
        isActive,
        minimumPrice,
        minimumPriceEth: formatUnits(minimumPrice, 18),
        owner,
      });

      setContractBalance(formatUnits(balance, 18));

      // Check if connected wallet is the owner
      const connectedAddress = wallet.address.toLowerCase();
      const ownerAddress = owner.toLowerCase();
      setIsOwner(connectedAddress === ownerAddress);

      // Pre-fill withdraw address with connected wallet
      if (!withdrawAddress) {
        setWithdrawAddress(wallet.address);
      }

      if (!isOwner) {
        console.log("Connected:", connectedAddress);
        console.log("Owner:", ownerAddress);
      }
    } catch (error) {
      console.error("Failed to load marketplace state:", error);
      toast.error("Failed to load marketplace state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadMarketplaceState();
    }
  }, [isConnected, wallet?.address]);

  const handleActivateMarketplace = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isOwner) {
      toast.error("Only the contract owner can activate the marketplace");
      return;
    }

    setLoading(true);
    try {
      const marketplace = await getMarketplaceContract();
      
      // Get current gas price and add 20% buffer
      const provider = await marketplace.runner.provider;
      const feeData = await provider.getFeeData();
      const maxFeePerGas = (feeData.maxFeePerGas * 120n) / 100n; // 20% buffer
      const maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 120n) / 100n;
      
      const tx = await marketplace.activateMarketPlace({
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      
      toast.loading("Activating marketplace...", { id: "activate" });
      await tx.wait();
      
      toast.success("Marketplace activated successfully!", { id: "activate" });
      await loadMarketplaceState();
    } catch (error) {
      console.error("Failed to activate marketplace:", error);
      
      if (error.message.includes("IsActive")) {
        toast.error("Marketplace is already active", { id: "activate" });
      } else if (error.message.includes("gas")) {
        toast.error("Gas price too low. Please try again.", { id: "activate" });
      } else {
        toast.error(error.message || "Failed to activate marketplace", { id: "activate" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetMinimumPrice = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isOwner) {
      toast.error("Only the contract owner can set minimum price");
      return;
    }

    if (!newMinPrice || parseFloat(newMinPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      const marketplace = await getMarketplaceContract();
      const priceInWei = parseUnits(newMinPrice, 18);
      
      // Get current gas price and add 20% buffer
      const provider = await marketplace.runner.provider;
      const feeData = await provider.getFeeData();
      const maxFeePerGas = (feeData.maxFeePerGas * 120n) / 100n;
      const maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 120n) / 100n;
      
      const tx = await marketplace.setMinimumPricePerUnit(priceInWei, {
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      
      toast.loading("Updating minimum price...", { id: "minprice" });
      await tx.wait();
      
      toast.success(`Minimum price set to ${newMinPrice} ETH`, { id: "minprice" });
      setNewMinPrice("");
      await loadMarketplaceState();
    } catch (error) {
      console.error("Failed to set minimum price:", error);
      
      if (error.message.includes("gas")) {
        toast.error("Gas price too low. Please try again.", { id: "minprice" });
      } else {
        toast.error(error.message || "Failed to set minimum price", { id: "minprice" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isOwner) {
      toast.error("Only the contract owner can withdraw funds");
      return;
    }

    if (!withdrawAddress || withdrawAddress.trim() === "") {
      toast.error("Please enter a valid withdrawal address");
      return;
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(withdrawAddress)) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    const balance = parseFloat(contractBalance);
    if (balance <= 0) {
      toast.error("No funds available to withdraw");
      return;
    }

    setLoading(true);
    try {
      const marketplace = await getMarketplaceContract();
      
      // Get current gas price and add 20% buffer
      const provider = marketplace.runner.provider;
      const feeData = await provider.getFeeData();
      const maxFeePerGas = (feeData.maxFeePerGas * 120n) / 100n;
      const maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 120n) / 100n;
      
      const tx = await marketplace.withdraw(withdrawAddress, {
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      
      toast.loading(`Withdrawing ${balance} ETH...`, { id: "withdraw" });
      await tx.wait();
      
      toast.success(`Successfully withdrew ${balance} ETH to ${withdrawAddress.substring(0, 6)}...${withdrawAddress.substring(38)}`, { id: "withdraw" });
      await loadMarketplaceState();
    } catch (error) {
      console.error("Failed to withdraw funds:", error);
      
      if (error.message.includes("gas")) {
        toast.error("Gas price too low. Please try again.", { id: "withdraw" });
      } else if (error.message.includes("Insufficient")) {
        toast.error("Insufficient contract balance", { id: "withdraw" });
      } else {
        toast.error(error.message || "Failed to withdraw funds", { id: "withdraw" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6">
        <div className="flex items-center gap-3 text-brand-gold-muted">
          <AlertCircle className="h-5 w-5" />
          <p>Connect your wallet to manage marketplace settings</p>
        </div>
      </div>
    );
  }

  if (loading && !marketplaceState) {
    return (
      <div className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6">
        <div className="flex items-center gap-3 text-brand-gold-muted">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <p>Loading marketplace state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Marketplace Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-brand-ink-light">Status</span>
            <div className="flex items-center gap-2">
              {marketplaceState?.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-500">Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-yellow-500">Inactive</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-brand-ink-light">Minimum Price</span>
            <span className="font-medium text-white">
              {marketplaceState?.minimumPriceEth} ETH per unit
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-brand-ink-light">Contract Balance</span>
            <span className="font-medium text-brand-cyan">
              {parseFloat(contractBalance).toFixed(6)} ETH
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-brand-ink-light">Your Role</span>
            <span className={`font-medium ${isOwner ? 'text-brand-gold' : 'text-brand-ink-light'}`}>
              {isOwner ? "Contract Owner" : "Not Owner"}
            </span>
          </div>

          {!isOwner && (
            <div className="mt-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <p className="text-sm text-yellow-500">
                ⚠️ You must connect with the contract owner wallet to manage marketplace settings.
              </p>
              <p className="mt-1 text-xs text-brand-ink-light">
                Owner: {marketplaceState?.owner}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Activate Button */}
      {!marketplaceState?.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Activate Marketplace</h3>
          <p className="mb-4 text-sm text-brand-ink-light">
            Activate the marketplace to allow users to create listings and purchase tokens.
          </p>
          <button
            onClick={handleActivateMarketplace}
            disabled={loading || !isOwner}
            className="flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-ink-darker transition-all hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Power className="h-5 w-5" />
            )}
            Activate Marketplace
          </button>
        </motion.div>
      )}

      {/* Set Minimum Price */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Set Minimum Price</h3>
        <p className="mb-4 text-sm text-brand-ink-light">
          Set the minimum price per unit (in ETH) that sellers must list at.
        </p>
        
        <form onSubmit={handleSetMinimumPrice} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-brand-ink-secondary">
              Minimum Price (ETH per unit)
            </label>
            <input
              type="number"
              step="0.000001"
              min="0"
              placeholder="0.001"
              value={newMinPrice}
              onChange={(e) => setNewMinPrice(e.target.value)}
              disabled={loading || !isOwner}
              className="admin-input"
            />
            <p className="mt-1 text-xs text-brand-ink-light">
              Current: {marketplaceState?.minimumPriceEth} ETH
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !isOwner || !newMinPrice}
            className="flex items-center gap-2 rounded-lg bg-brand-cyan px-6 py-3 font-semibold text-white transition-all hover:bg-brand-cyan-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <DollarSign className="h-5 w-5" />
            )}
            Update Minimum Price
          </button>
        </form>
      </motion.div>

      {/* Withdraw Funds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-brand-ink-light/20 bg-brand-ink-darker p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Withdraw Funds</h3>
        <p className="mb-4 text-sm text-brand-ink-light">
          Withdraw accumulated marketplace fees to a specified address.
        </p>
        
        <div className="mb-4 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-ink-light">Available Balance:</span>
            <span className="text-lg font-semibold text-brand-cyan">
              {parseFloat(contractBalance).toFixed(6)} ETH
            </span>
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-brand-ink-secondary">
              Withdrawal Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              disabled={loading || !isOwner}
              className="admin-input font-mono text-sm"
            />
            <p className="mt-1 text-xs text-brand-ink-light">
              Funds will be sent to this Ethereum address
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !isOwner || !withdrawAddress || parseFloat(contractBalance) <= 0}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Wallet className="h-5 w-5" />
            )}
            Withdraw Funds
          </button>
        </form>
      </motion.div>

      {/* Refresh Button */}
      <button
        onClick={loadMarketplaceState}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-ink-light/20 bg-brand-ink-darker px-4 py-2 text-sm text-brand-ink-light transition-all hover:bg-brand-ink-light/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh Status
      </button>
    </div>
  );
};

export default MarketplaceControls;
