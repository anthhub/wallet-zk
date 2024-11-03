import React, { useState } from 'react';
import { KeyRound, X, AlertCircle } from 'lucide-react';
import { importWalletFromMnemonic } from '../lib/wallet';

interface ImportWalletProps {
  onImport: (wallet: { address: string; privateKey: string; mnemonic: string }) => void;
  onClose: () => void;
  pin: string;
}

export function ImportWallet({ onImport, onClose, pin }: ImportWalletProps) {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const wallet = importWalletFromMnemonic(mnemonic.trim(), pin);
      onImport(wallet);
    } catch (err) {
      console.error('Import error:', err);
      setError('Invalid mnemonic phrase. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <KeyRound className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">Import Wallet</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-400 mb-1">
              Recovery Phrase
            </label>
            <textarea
              id="mnemonic"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              className="w-full h-32 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500 p-3"
              placeholder="Enter your 12 or 24-word recovery phrase..."
              required
            />
            <p className="mt-1 text-sm text-gray-400">
              Usually 12 or 24 words separated by spaces
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Import Wallet
          </button>
        </form>
      </div>
    </div>
  );
}