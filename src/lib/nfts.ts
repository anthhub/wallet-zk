import { createPublicClient, http } from 'viem';
import { mainnet, goerli, sepolia } from 'viem/chains';
import type { NFT } from '../types/wallet';

const ERC721_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
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

export const getNFTsForAddress = async (
  contractAddress: string,
  walletAddress: string,
  network: string
): Promise<NFT[]> => {
  const client = createPublicClient({
    chain: getChainConfig(network),
    transport: http(),
  });

  try {
    const balance = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: ERC721_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    });

    const nfts: NFT[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [walletAddress as `0x${string}`, BigInt(i)],
      });

      const tokenURI = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      });

      const metadata = await fetch(tokenURI).then(res => res.json());

      nfts.push({
        tokenId: tokenId.toString(),
        contractAddress,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        },
      });
    }

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};