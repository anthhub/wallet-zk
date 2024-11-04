import React from 'react';
import { Link } from 'lucide-react';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { useTranslation } from 'react-i18next';

interface WalletConnectProps {
  address: string | null;
  network: string;
  onPermissionRequest: (origin: string) => Promise<boolean>;
}

export function WalletConnect({ address, network, onPermissionRequest }: WalletConnectProps) {
  const { t } = useTranslation();
  const { connect, disconnect, connected } = useWalletConnect({
    address,
    network,
    onPermissionRequest
  });

  return (
    <div className="flex items-center space-x-2">
      {connected ? (
        <button
          onClick={disconnect}
          className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
        >
          <Link className="h-4 w-4 mr-1" />
          {t('wallet.disconnect')}
        </button>
      ) : (
        <button
          onClick={connect}
          className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
        >
          <Link className="h-4 w-4 mr-1" />
          {t('wallet.connect')}
        </button>
      )}
    </div>
  );
}