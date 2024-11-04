import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";

// 核心配置类型
interface WalletConnectConfig {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

// 初始化 WalletConnect 核心
export async function initializeWeb3Wallet(config: WalletConnectConfig) {
  try {
    const core = new Core({
      projectId: "b479590efeefdf98a5416e8cf2d48ebc",
    });

    const web3wallet = await Web3Wallet.init({
      core,
      metadata: config,
    });

    return web3wallet;
  } catch (error) {
    console.error("Failed to initialize wallet:", error);
    return null;
  }
}

// 获取链 ID 和网络名称
export function getChainData(network: string) {
  const chainId =
    network === "mainnet" ? "1" : network === "goerli" ? "5" : "11155111";
  const namespace = `eip155:${chainId}`;
  return { chainId, namespace };
}

// 构建命名空间配置
export function buildNamespaces(namespace: string, account: string) {
  return {
    eip155: {
      chains: [namespace],
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "personal_sign",
        "eth_sign",
      ],
      events: ["chainChanged", "accountsChanged"],
      accounts: [account],
    },
  };
}

// 错误处理工具
export function handleWalletError(error: unknown, message: string) {
  console.error(message, error);
  return {
    code: 4001,
    message: error instanceof Error ? error.message : message,
  };
}
