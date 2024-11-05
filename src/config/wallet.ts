export const WALLET_METADATA = {
  name: "Your Web3 Wallet",
  description: "A secure Web3 wallet",
  url: window.location.origin,
  icons: ["https://your-wallet-icon.com"],
  redirect: {
    native: "yourwallet://", // 移动端 App 的 Deep Link
    universal: window.location.origin,
  },
};
