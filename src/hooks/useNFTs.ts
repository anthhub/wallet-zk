import { useState, useEffect } from 'react';
import { getNFTsForAddress } from '../lib/nfts';
import type { NFT } from '../types/wallet';

// Example NFT contract addresses (update with real addresses)
const NFT_CONTRACTS = {
  mainnet: [
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // BAYC
  ],
  goerli: [],
  sepolia: [],
};

export function useNFTs(walletAddress: string | null, network: string) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!walletAddress) return;

      setLoading(true);
      setError(null);

      try {
        const contractAddresses = NFT_CONTRACTS[network as keyof typeof NFT_CONTRACTS];
        const nftPromises = contractAddresses.map(address =>
          getNFTsForAddress(address, walletAddress, network)
        );

        const nftCollections = await Promise.all(nftPromises);
        const allNfts = nftCollections.flat();

        setNfts(allNfts);
      } catch (err) {
        setError('Failed to fetch NFTs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [walletAddress, network]);

  return { nfts, loading, error };
}