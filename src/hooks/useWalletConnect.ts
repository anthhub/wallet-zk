import { useState, useCallback, useEffect } from 'react';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletConnectModal } from '@walletconnect/modal';

const projectId = 'YOUR_PROJECT_ID'; // Get this from WalletConnect Cloud

const modal = new WalletConnectModal({
  projectId,
  themeMode: 'dark',
});

export function useWalletConnect() {
  const [provider, setProvider] = useState<EthereumProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  const initializeProvider = useCallback(async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId,
        showQrModal: true,
        chains: [1], // Mainnet
        optionalChains: [5, 11155111], // Goerli, Sepolia
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        events: ['chainChanged', 'accountsChanged'],
      });

      setProvider(provider);

      provider.on('connect', () => {
        setConnected(true);
        setUri(null);
      });

      provider.on('disconnect', () => {
        setConnected(false);
        setUri(null);
      });

      return provider;
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      return null;
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const currentProvider = provider || await initializeProvider();
      if (!currentProvider) return;

      await currentProvider.connect();
      modal.openModal();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [provider, initializeProvider]);

  const disconnect = useCallback(async () => {
    try {
      if (provider) {
        await provider.disconnect();
        modal.closeModal();
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }, [provider]);

  useEffect(() => {
    initializeProvider();
    return () => {
      if (provider) {
        provider.removeListener('connect', () => setConnected(true));
        provider.removeListener('disconnect', () => setConnected(false));
      }
    };
  }, []);

  return {
    connect,
    disconnect,
    connected,
    uri,
    provider,
  };
}