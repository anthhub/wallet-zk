import React from 'react';
import { Image } from 'lucide-react';
import type { NFT } from '../types/wallet';

interface NFTGridProps {
  nfts: NFT[];
}

export function NFTGrid({ nfts }: NFTGridProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">NFTs</h2>
        <Image className="h-5 w-5 text-gray-400" />
      </div>
      {nfts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No NFTs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div
              key={`${nft.contractAddress}-${nft.tokenId}`}
              className="bg-gray-700 rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold truncate">{nft.metadata.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {nft.metadata.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Token ID: {nft.tokenId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}