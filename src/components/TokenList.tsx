import React from 'react';
import { Coins } from 'lucide-react';
import type { Token } from '../types/wallet';

interface TokenListProps {
  tokens: Token[];
}

export function TokenList({ tokens }: TokenListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tokens</h2>
        <Coins className="h-5 w-5 text-gray-400" />
      </div>
      {tokens.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No tokens found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-bold">{token.symbol}</p>
                <p className="text-sm text-gray-400">
                  {parseFloat(token.balance).toFixed(4)}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}