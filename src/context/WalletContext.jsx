import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  connectWallet,
  disconnectWallet,
  getWalletState,
  isArbitrum,
  switchToArbitrum,
} from "../utils/wallet";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const refreshWallet = useCallback(async () => {
    try {
      const state = await getWalletState();
      setWallet(state);
      return state;
    } catch {
      setWallet(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleAccountsChanged = (accounts) => {
      if (!accounts.length) {
        setWallet(null);
        return;
      }
      refreshWallet();
    };

    const handleChainChanged = () => {
      refreshWallet();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [refreshWallet]);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const state = await connectWallet();
      if (!isArbitrum(state.chainId)) {
        await switchToArbitrum();
        const refreshed = await getWalletState();
        setWallet(refreshed);
        return refreshed;
      }
      setWallet(state);
      return state;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setWallet(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      wallet,
      connecting,
      error,
      isConnected: Boolean(wallet?.address),
      connect,
      disconnect,
      refreshWallet,
    }),
    [wallet, connecting, error, connect, disconnect, refreshWallet],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
