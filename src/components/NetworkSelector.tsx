import React from 'react';
import type { WalletState } from '../types/wallet';

interface NetworkSelectorProps {
  network: WalletState['network'];
  onChange: (network: WalletState['network']) => void;
}

export function NetworkSelector({ network, onChange }: NetworkSelectorProps) {
  return (
    <select 
      className="bg-gray-700 rounded-lg px-3 py-1 text-sm"
      value={network}
      onChange={(e) => onChange(e.target.value as WalletState['network'])}
    >
      <option value="mainnet">Mainnet</option>
      <option value="goerli">Goerli</option>
      <option value="sepolia">Sepolia</option>
    </select>
  );
}