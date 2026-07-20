import React, { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCw, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useWallet } from "../../context/WalletContext";
import {
  CONTRACTS,
  getExplorerAddressUrl,
  getTargetChain,
} from "../../config/web3";
import {
  purchaseListing,
  readListing,
  readMarketplaceState,
  readTokenBalance,
} from "../../utils/contracts";
import { shortenAddress } from "../../utils/wallet";

const MarketplaceOnChainPanel = () => {
  const { wallet, isConnected, connect } = useWallet();
  const chain = getTargetChain();
  const [loading, setLoading] = useState(false);
  const [marketState, setMarketState] = useState(null);
  const [listing, setListing] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [listingId, setListingId] = useState(CONTRACTS.defaultListingId);
  const [purchaseAmount, setPurchaseAmount] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    if (!isConnected) {
      setMarketState(null);
      setListing(null);
      setTokenBalance(null);
      return;
    }

    setLoading(true);
    try {
      const [state, activeListing, balance] = await Promise.all([
        readMarketplaceState(),
        readListing(listingId).catch(() => null),
        readTokenBalance(wallet.address),
      ]);
      setMarketState(state);
      setListing(activeListing);
      setTokenBalance(balance);
    } catch (error) {
      toast.error(error.message || "Failed to load on-chain data");
    } finally {
      setLoading(false);
    }
  }, [isConnected, listingId, wallet?.address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handlePurchase = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast.error(error.message || "Connect a wallet first");
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await purchaseListing({
        listingId,
        tokenAmount: purchaseAmount,
      });
      toast.success("On-chain purchase confirmed");
      window.open(result.explorerUrl, "_blank", "noopener,noreferrer");
      await refresh();
    } catch (error) {
      toast.error(error.shortMessage || error.message || "Purchase failed");
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedTotal =
    listing?.active && purchaseAmount
      ? (Number(purchaseAmount) * Number(listing.pricePerUnitEth)).toFixed(6)
      : "0";

  return (
    <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-brand-bg-panel/45 p-5 shadow-glass backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold-light">
            On-chain contracts
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            {chain.name} marketplace demo
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-brand-ink-secondary">
            Interact with your deployed contracts from the app. Verify source on
            Arbiscan to use Read/Write tabs there too.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading || !isConnected}
          className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-xl border border-white/10 px-4 text-sm text-brand-ink-secondary hover:border-brand-cyan/40 hover:text-brand-cyan disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ContractLink
          label="RWAPropertyToken"
          address={CONTRACTS.propertyToken}
        />
        <ContractLink label="RWAMarketplace" address={CONTRACTS.marketplace} />
      </div>

      {!isConnected ? (
        <p className="mt-5 rounded-xl border border-white/10 bg-brand-bg-base/40 p-4 text-sm text-brand-ink-secondary">
          Connect your wallet above to read marketplace state and purchase
          listed tokens on-chain.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-brand-bg-base/40 p-4 text-sm">
            <p className="font-medium text-white">Marketplace state</p>
            <dl className="mt-3 space-y-2 text-brand-ink-secondary">
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd className={marketState?.isActive ? "text-emerald-300" : "text-amber-300"}>
                  {marketState?.isActive ? "Active" : "Paused"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Min price / unit</dt>
                <dd className="font-mono text-white">
                  {marketState?.minimumPriceEth ?? "—"} ETH
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Next listing ID</dt>
                <dd className="font-mono text-white">
                  {marketState?.nextListingId ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Your BTPT balance</dt>
                <dd className="font-mono text-white">
                  {tokenBalance?.formatted ?? "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-brand-bg-base/40 p-4 text-sm">
            <p className="font-medium text-white">Purchase listing</p>
            <div className="mt-3 grid gap-3">
              <label className="block">
                <span className="mb-1 block text-brand-ink-secondary">Listing ID</span>
                <input
                  className="admin-input"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                />
              </label>
              {listing && (
                <p className="text-xs text-brand-ink-muted">
                  Listing #{listingId}: {listing.active ? "active" : "inactive"} ·{" "}
                  {listing.amountFormatted} tokens @ {listing.pricePerUnitEth} ETH each · seller{" "}
                  {shortenAddress(listing.seller)}
                </p>
              )}
              <label className="block">
                <span className="mb-1 block text-brand-ink-secondary">Token amount</span>
                <input
                  className="admin-input"
                  type="number"
                  min="0.000001"
                  step="0.000001"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
              </label>
              <p className="text-xs text-brand-ink-secondary">
                Estimated total: <span className="font-mono text-white">{estimatedTotal} ETH</span>
              </p>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={submitting || !listing?.active}
                className="btn btn-hero-primary inline-flex min-h-[44px] items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {submitting ? "Confirm in wallet…" : "Purchase on-chain"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ContractLink({ label, address }) {
  return (
    <a
      href={getExplorerAddressUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-brand-bg-base/40 px-4 py-3 text-sm transition hover:border-brand-cyan/30"
    >
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="font-mono text-xs text-brand-ink-secondary">{address}</p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-brand-cyan" />
    </a>
  );
}

export default MarketplaceOnChainPanel;
