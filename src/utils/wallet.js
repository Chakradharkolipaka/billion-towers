const ARBITRUM_CHAIN_ID = "0xa4b1";

export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function hasWalletProvider() {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

export async function connectWallet() {
  if (!hasWalletProvider()) {
    throw new Error("No Web3 wallet detected. Install MetaMask or another compatible wallet.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const address = accounts[0];
  const balance = await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });

  return {
    address,
    chainId,
    balanceWei: balance,
    balanceEth: formatWeiToEth(balance),
  };
}

export async function disconnectWallet() {
  return null;
}

export async function getWalletState() {
  if (!hasWalletProvider()) {
    return null;
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  if (!accounts.length) {
    return null;
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const balance = await window.ethereum.request({
    method: "eth_getBalance",
    params: [accounts[0], "latest"],
  });

  return {
    address: accounts[0],
    chainId,
    balanceWei: balance,
    balanceEth: formatWeiToEth(balance),
  };
}

export function formatWeiToEth(weiHex) {
  const wei = parseInt(weiHex, 16);
  const eth = wei / 1e18;
  return eth.toFixed(4);
}

export function isArbitrum(chainId) {
  return chainId?.toLowerCase() === ARBITRUM_CHAIN_ID;
}

export async function switchToArbitrum() {
  if (!hasWalletProvider()) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARBITRUM_CHAIN_ID }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ARBITRUM_CHAIN_ID,
            chainName: "Arbitrum One",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            blockExplorerUrls: ["https://arbiscan.io"],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

export function isGooglePayAvailable() {
  return typeof window !== "undefined" && Boolean(window.PaymentRequest);
}

export function isApplePayAvailable() {
  if (typeof window === "undefined" || !window.PaymentRequest) {
    return false;
  }

  try {
    const request = new PaymentRequest(
      [{ supportedMethods: "https://apple.com/apple-pay" }],
      { total: { label: "Test", amount: { currency: "USD", value: "1.00" } } },
    );
    return request.canMakePayment
      ? request.canMakePayment().then(Boolean).catch(() => false)
      : Promise.resolve(false);
  } catch {
    return Promise.resolve(false);
  }
}

export async function payWithDigitalWallet({ amount, label, method }) {
  if (!window.PaymentRequest) {
    throw new Error("Digital wallet payments are not supported in this browser.");
  }

  const supportedMethods =
    method === "apple_pay"
      ? [{ supportedMethods: "https://apple.com/apple-pay" }]
      : [
          { supportedMethods: "https://google.com/pay" },
          { supportedMethods: "basic-card" },
        ];

  const paymentRequest = new PaymentRequest(supportedMethods, {
    total: {
      label,
      amount: { currency: "USD", value: Number(amount).toFixed(2) },
    },
  });

  const canPay = await paymentRequest.canMakePayment();
  if (!canPay) {
    throw new Error(
      method === "apple_pay"
        ? "Apple Pay is not available on this device."
        : "Google Pay is not available on this device.",
    );
  }

  const response = await paymentRequest.show();
  await response.complete("success");
  return {
    payerEmail: response.payerEmail,
    payerPhone: response.payerPhone,
    methodName: response.methodName,
  };
}
