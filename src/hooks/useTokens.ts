import { useState, useEffect } from 'react';
import { getTokenBalance } from '../lib/tokens';
import type { Token } from '../types/wallet';

// Common ERC-20 token addresses (example for mainnet)
const COMMON_TOKENS = {
  mainnet: [
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  ],
  goerli: [],
  sepolia: [],
};

export function useTokens(walletAddress: string | null, network: string) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletAddress) return;

      setLoading(true);
      setError(null);

      try {
        const tokenAddresses = COMMON_TOKENS[network as keyof typeof COMMON_TOKENS];
        const tokenPromises = tokenAddresses.map(address =>
          getTokenBalance(address, walletAddress, network)
        );

        const tokens = await Promise.all(tokenPromises);
        const nonZeroTokens = tokens.filter(
          token => parseFloat(token.balance) > 0
        );

        setTokens(nonZeroTokens);
      } catch (err) {
        setError('Failed to fetch token balances');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [walletAddress, network]);

  return { tokens, loading, error };
}