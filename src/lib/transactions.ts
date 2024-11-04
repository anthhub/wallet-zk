import { ethers } from 'ethers';
import { checkPermission } from './permissions';
import { decryptData } from './crypto';

interface TransactionParams {
  to: string;
  value: string;
  data?: string;
  from: string;
  network: string;
  pin: string;
}

// 获取私钥
async function getPrivateKey(pin: string): Promise<string> {
  const encrypted = localStorage.getItem('encrypted_private_key');
  if (!encrypted) throw new Error('No private key found');
  try {
    return decryptData(JSON.parse(encrypted), pin);
  } catch {
    throw new Error('Invalid PIN');
  }
}

// 签名交易
export async function signTransaction(params: TransactionParams) {
  const { to, value, data, from, network, pin } = params;
  
  // 验证权限
  if (!checkPermission(from, 'sign', value)) {
    throw new Error('Transaction exceeds permitted amount');
  }
  
  try {
    const privateKey = await getPrivateKey(pin);
    const wallet = new ethers.Wallet(privateKey);
    
    const transaction = {
      to,
      value: ethers.parseEther(value),
      data: data || '0x',
      chainId: network === 'mainnet' ? 1 : network === 'goerli' ? 5 : 11155111
    };
    
    return wallet.signTransaction(transaction);
  } catch (error) {
    throw new Error('Failed to sign transaction');
  }
}

// 发送交易
export async function sendTransaction(params: TransactionParams) {
  const signed = await signTransaction(params);
  
  try {
    // 使用环境变量获取 Infura Key
    const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;
    if (!INFURA_KEY) throw new Error('Missing Infura Key');
    
    const provider = new ethers.JsonRpcProvider(
      `https://${params.network}.infura.io/v3/${INFURA_KEY}`
    );
    
    // 添加 gas 估算
    const gasPrice = await provider.getFeeData();
    const tx = await provider.broadcastTransaction(signed, {
      maxFeePerGas: gasPrice.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas
    });
    
    // 等待交易确认
    await tx.wait(1);
    return tx.hash;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send transaction');
  }
}