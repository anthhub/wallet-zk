import React from 'react';
import { Wallet } from 'lucide-react';
import { NetworkSelector } from './NetworkSelector';
import { WalletConnect } from './WalletConnect';
import type { WalletState } from '../types/wallet';
import { useTranslation } from 'react-i18next';

interface WalletHeaderProps {
  network: WalletState['network'];
  address: string | null;
  onNetworkChange: (network: WalletState['network']) => void;
  onPermissionRequest: (origin: string) => Promise<boolean>;
}

export function WalletHeader({ 
  network, 
  address,
  onNetworkChange,
  onPermissionRequest 
}: WalletHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">{t('wallet.title')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkSelector network={network} onChange={onNetworkChange} />
            <WalletConnect 
              address={address}
              network={network}
              onPermissionRequest={onPermissionRequest}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}