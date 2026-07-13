import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  CreditCard,
  Building2,
  Smartphone,
  Apple,
} from "lucide-react";
import toast from "react-hot-toast";
import { useWallet } from "../../context/WalletContext";
import { useAuth } from "../../context/AuthContext";
import * as paymentApi from "../../api/paymentApi";
import {
  hasWalletProvider,
  payWithDigitalWallet,
  shortenAddress,
} from "../../utils/wallet";

const PAYMENT_METHODS = [
  { id: "wallet", label: "Wallet", icon: Wallet, description: "Pay with connected Web3 wallet" },
  { id: "card", label: "Card", icon: CreditCard, description: "Visa, Mastercard, Amex" },
  { id: "bank", label: "Bank", icon: Building2, description: "ACH or wire transfer" },
  { id: "google_pay", label: "Google Pay", icon: Smartphone, description: "Fast mobile checkout" },
  { id: "apple_pay", label: "Apple Pay", icon: Apple, description: "Pay with Apple Wallet" },
];

const defaultShares = 10;

const InvestCheckoutModal = ({ property, isOpen, onClose }) => {
  const { wallet, isConnected, connect } = useWallet();
  const { user, isAuthenticated } = useAuth();
  const [method, setMethod] = useState("wallet");
  const [shares, setShares] = useState(defaultShares);
  const [submitting, setSubmitting] = useState(false);
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });
  const [bankForm, setBankForm] = useState({
    accountName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
  });
  const [contact, setContact] = useState({
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    if (isOpen) {
      setShares(defaultShares);
      setMethod("wallet");
      setContact((prev) => ({ ...prev, email: user?.email || prev.email }));
    }
  }, [isOpen, user]);

  const sharePrice = useMemo(() => {
    if (!property) return 0;
    return (property.price * 1000) / (property.totalShares || 1);
  }, [property]);

  const totalAmount = useMemo(() => sharePrice * shares, [sharePrice, shares]);

  if (!property) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in before investing");
      return;
    }

    if (!contact.email) {
      toast.error("Email is required");
      return;
    }

    if (method === "wallet" && !isConnected) {
      try {
        await connect();
      } catch (error) {
        toast.error(error.message || "Connect a wallet first");
        return;
      }
    }

    setSubmitting(true);

    try {
      let paymentMeta = {};
      let walletAddress = wallet?.address;
      let payerEmail = contact.email;

      if (method === "wallet" && !walletAddress) {
        const connected = await connect();
        walletAddress = connected?.address;
      }

      if (method === "card") {
        if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvc) {
          throw new Error("Complete all card fields");
        }
        paymentMeta = {
          cardLast4: cardForm.number.slice(-4),
          cardBrand: detectCardBrand(cardForm.number),
          cardholder: cardForm.name,
        };
      }

      if (method === "bank") {
        if (!bankForm.accountName || !bankForm.routingNumber || !bankForm.accountNumber) {
          throw new Error("Complete all bank fields");
        }
        paymentMeta = {
          accountName: bankForm.accountName,
          accountType: bankForm.accountType,
          accountLast4: bankForm.accountNumber.slice(-4),
          routingLast4: bankForm.routingNumber.slice(-4),
        };
      }

      if (method === "google_pay" || method === "apple_pay") {
        const digital = await payWithDigitalWallet({
          amount: totalAmount,
          label: property.name,
          method,
        });
        paymentMeta = digital;
        if (digital.payerEmail) {
          payerEmail = digital.payerEmail;
        }
      }

      const payload = {
        propertyId: String(property.id),
        propertyName: property.name,
        shares: Number(shares),
        amount: Number(totalAmount.toFixed(2)),
        method,
        walletAddress: method === "wallet" ? walletAddress : undefined,
        email: payerEmail,
        phone: contact.phone,
        paymentMeta,
      };

      const result = await paymentApi.createInvestment(payload);
      toast.success(result.message || "Investment submitted successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-[5vh] z-[210] mx-auto max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-brand-bg-raised shadow-2xl sm:inset-x-auto"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-brand-bg-raised/95 px-5 py-4 backdrop-blur-md sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-cyan">
                  Invest
                </p>
                <h2 id="checkout-title" className="text-lg font-semibold text-white">
                  {property.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-brand-ink-secondary hover:bg-white/5 hover:text-white"
                aria-label="Close checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
              {!isAuthenticated && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                  You must be signed in to complete an investment.{" "}
                  <Link to="/login" className="font-semibold text-brand-cyan underline">
                    Sign in
                  </Link>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm text-brand-ink-secondary">Shares</span>
                  <input
                    type="number"
                    min="1"
                    max={property.availableShares || 1000}
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="admin-input"
                    required
                  />
                </label>
                <div className="rounded-xl border border-white/10 bg-brand-bg-base/50 p-4 sm:col-span-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-ink-secondary">Price per share</span>
                    <span className="font-semibold text-white">${sharePrice.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-brand-ink-secondary">Total</span>
                    <span className="text-lg font-bold text-brand-cyan">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-white">Payment method</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((item) => {
                    const Icon = item.icon;
                    const selected = method === item.id;
                    const disabled =
                      item.id === "wallet" && !hasWalletProvider() && !isConnected;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setMethod(item.id)}
                        className={`rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-brand-cyan/50 bg-brand-cyan/10"
                            : "border-white/10 bg-brand-bg-base/40 hover:border-brand-cyan/30"
                        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        <Icon className={`mb-2 h-5 w-5 ${selected ? "text-brand-cyan" : "text-brand-ink-secondary"}`} />
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="mt-0.5 text-[11px] text-brand-ink-muted">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {method === "wallet" && (
                <div className="rounded-xl border border-brand-cyan/25 bg-brand-cyan/5 p-4 text-sm">
                  {isConnected ? (
                    <p className="text-brand-ink-secondary">
                      Paying from <span className="font-mono text-white">{shortenAddress(wallet.address)}</span>
                      {" "}({wallet.balanceEth} ETH available)
                    </p>
                  ) : (
                    <p className="text-brand-ink-secondary">
                      No wallet connected. You will be prompted to connect before confirming payment.
                    </p>
                  )}
                </div>
              )}

              {method === "card" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2 block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Cardholder name</span>
                    <input className="admin-input" value={cardForm.name} onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))} required />
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Card number</span>
                    <input className="admin-input" inputMode="numeric" placeholder="4242 4242 4242 4242" value={cardForm.number} onChange={(e) => setCardForm((p) => ({ ...p, number: e.target.value.replace(/\s/g, "") }))} required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Expiry (MM/YY)</span>
                    <input className="admin-input" placeholder="12/28" value={cardForm.expiry} onChange={(e) => setCardForm((p) => ({ ...p, expiry: e.target.value }))} required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">CVC</span>
                    <input className="admin-input" inputMode="numeric" value={cardForm.cvc} onChange={(e) => setCardForm((p) => ({ ...p, cvc: e.target.value }))} required />
                  </label>
                </div>
              )}

              {method === "bank" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2 block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Account holder name</span>
                    <input className="admin-input" value={bankForm.accountName} onChange={(e) => setBankForm((p) => ({ ...p, accountName: e.target.value }))} required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Routing number</span>
                    <input className="admin-input" inputMode="numeric" value={bankForm.routingNumber} onChange={(e) => setBankForm((p) => ({ ...p, routingNumber: e.target.value }))} required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Account number</span>
                    <input className="admin-input" inputMode="numeric" value={bankForm.accountNumber} onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))} required />
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="mb-2 block text-sm text-brand-ink-secondary">Account type</span>
                    <select className="admin-input" value={bankForm.accountType} onChange={(e) => setBankForm((p) => ({ ...p, accountType: e.target.value }))}>
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </label>
                </div>
              )}

              {(method === "google_pay" || method === "apple_pay") && (
                <div className="rounded-xl border border-white/10 bg-brand-bg-base/50 p-4 text-sm text-brand-ink-secondary">
                  {method === "google_pay" ? (
                    <p>Use Google Pay for a fast, secure checkout. Your browser will open the native payment sheet.</p>
                  ) : (
                    <p>Use Apple Pay on supported Safari devices. Touch ID or Face ID may be required.</p>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-brand-ink-secondary">Email</span>
                  <input type="email" className="admin-input" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-brand-ink-secondary">Phone (optional)</span>
                  <input type="tel" className="admin-input" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || !isAuthenticated}
                className="btn btn-hero-primary w-full min-h-[48px] disabled:opacity-60"
              >
                {submitting ? "Processing…" : `Confirm payment · $${totalAmount.toFixed(2)}`}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function detectCardBrand(number) {
  if (number.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  return "card";
}

export default InvestCheckoutModal;
