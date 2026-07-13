import React from "react";
import { motion } from "framer-motion";
import { Wallet, Unplug, RefreshCw } from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import { shortenAddress } from "../../utils/wallet";
import toast from "react-hot-toast";

const MarketplaceWalletBar = () => {
  const { wallet, isConnected, connecting, connect, disconnect, refreshWallet } =
    useWallet();

  const handleConnect = async () => {
    try {
      const state = await connect();
      toast.success(`Wallet connected: ${shortenAddress(state.address)}`);
    } catch (error) {
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast.success("Wallet disconnected");
  };

  return (
    <motion.div
      className="mx-auto max-w-7xl rounded-2xl border border-brand-cyan/20 bg-brand-bg-panel/55 p-4 shadow-glass backdrop-blur-md sm:p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-cyan">
            Web3 checkout
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            Connect your wallet to invest on-chain
          </h2>
          <p className="mt-1 text-sm text-brand-ink-secondary">
            Supports MetaMask and other EIP-1193 wallets. Fiat options available at checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isConnected ? (
            <>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm">
                <p className="text-[11px] uppercase tracking-wide text-emerald-200/80">Connected</p>
                <p className="font-mono font-medium text-white">{shortenAddress(wallet.address)}</p>
                <p className="text-xs text-brand-ink-secondary">{wallet.balanceEth} ETH</p>
              </div>
              <button
                type="button"
                onClick={() => refreshWallet()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-brand-ink-secondary hover:border-brand-cyan/40 hover:text-brand-cyan"
                aria-label="Refresh wallet"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="btn btn-hero-secondary inline-flex min-h-[44px] items-center gap-2"
              >
                <Unplug className="h-4 w-4" />
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="btn btn-hero-primary inline-flex min-h-[48px] items-center gap-2 disabled:opacity-60"
            >
              <Wallet className="h-5 w-5" />
              {connecting ? "Connecting…" : "Connect wallet"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplaceWalletBar;
