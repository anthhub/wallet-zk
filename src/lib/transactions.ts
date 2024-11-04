import { ethers } from "ethers";
import { checkPermission } from "./permissions";
import { decryptData } from "./crypto";
import { parseEther } from "viem";

interface TransactionParams {
  to: `0x${string}`;
  value: string;
  data?: string;
  from: `0x${string}`;
  network: "mainnet" | "goerli" | "sepolia";
  pin: string;
}

// 获取私钥
async function getPrivateKey(pin: string): Promise<string> {
  const encrypted = localStorage.getItem("encrypted_private_key");
  if (!encrypted) throw new Error("No private key found");
  try {
    return decryptData(JSON.parse(encrypted), pin);
  } catch {
    throw new Error("Invalid PIN");
  }
}

// 添加 Alchemy Provider 获取函数
function getProvider(network: string) {
  const ALCHEMY_KEY = "Oa41Y_lM8GrxnM2QKlt4KtEP4AOyFLA7";
  if (!ALCHEMY_KEY) throw new Error("缺少 Alchemy Key");

  const networkUrl = {
    mainnet: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    goerli: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    sepolia: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  }[network];

  if (!networkUrl) throw new Error("不支持的网络");

  return new ethers.providers.JsonRpcProvider(networkUrl);
}

// 签名交易
export async function signTransaction(
  params: TransactionParams
): Promise<string> {
  const { to, value, data, from, network, pin } = params;

  // 验证权限
  if (!checkPermission(from, "sign", value)) {
    throw new Error("交易金额超出允许范围");
  }

  try {
    const privateKey = await getPrivateKey(pin);
    const wallet = new ethers.Wallet(privateKey);

    // 获取 provider
    const provider = getProvider(network);

    // 获取 nonce 和 gas 数据
    const [nonce, feeData] = await Promise.all([
      provider.getTransactionCount(from),
      provider.getFeeData(),
    ]);

    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      throw new Error("无法获取 gas 费用数据");
    }

    // 构建交易对象
    const transaction = {
      to,
      from,
      nonce,
      value: parseEther(value),
      data: data || "0x",
      chainId: network === "mainnet" ? 1 : network === "goerli" ? 5 : 11155111,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      gasLimit: data
        ? await provider.estimateGas({
            to,
            from,
            value: parseEther(value),
            data: data || "0x",
          })
        : 21000n,
      type: 2,
    };

    // 签名交易
    const signedTx = await wallet.signTransaction(transaction);
    return signedTx;
  } catch (error) {
    console.error("签名交易失败:", error);
    throw new Error(error instanceof Error ? error.message : "签名交易失败");
  }
}

// 发送交易
export async function sendTransaction(
  params: TransactionParams
): Promise<`0x${string}`> {
  try {
    // 签名交易
    const signedTx = await signTransaction(params);

    // 获取 provider 并广播交易
    const provider = getProvider(params.network);
    const tx = await provider.sendTransaction(signedTx);

    // 等待一个区块确认
    await tx.wait(1);

    return tx.hash as `0x${string}`;
  } catch (error) {
    console.error("发送交易失败:", error);
    throw new Error(error instanceof Error ? error.message : "发送交易失败");
  }
}
