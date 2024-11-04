export const WALLET_METADATA = {
  name: "Your Web3 Wallet",
  description: "A secure Web3 wallet",
  url: process.env.NEXT_PUBLIC_WALLET_URL,
  icons: ["https://your-wallet-icon.com"],
  redirect: {
    native: "yourwallet://", // 移动端 App 的 Deep Link
    universal: process.env.NEXT_PUBLIC_WALLET_URL // H5 钱包的 URL
  }
} 