import React from 'react';
import { Wallet } from 'lucide-react';
import { NetworkSelector } from './NetworkSelector';
import { WalletConnect } from './WalletConnect';
import type { WalletState } from '../types/wallet';

interface WalletHeaderProps {
  network: WalletState['network'];
  onNetworkChange: (network: WalletState['network']) => void;
}

export function WalletHeader({ network, onNetworkChange }: WalletHeaderProps) {
  return (
    <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">Web3 Wallet</span>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkSelector network={network} onChange={onNetworkChange} />
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}