import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet, goerli, sepolia } from 'viem/chains';
import type { Token } from '../types/wallet';

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const getChainConfig = (network: string) => {
  switch (network) {
    case 'mainnet':
      return mainnet;
    case 'goerli':
      return goerli;
    case 'sepolia':
      return sepolia;
    default:
      return mainnet;
  }
};

export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string,
  network: string
): Promise<Token> => {
  const client = createPublicClient({
    chain: getChainConfig(network),
    transport: http(),
  });

  const [balance, decimals, symbol] = await Promise.all([
    client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    }),
    client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }),
    client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
  ]);

  return {
    address: tokenAddress,
    symbol,
    decimals,
    balance: formatUnits(balance, decimals),
  };
};