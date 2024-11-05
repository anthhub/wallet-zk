import React, { useState } from 'react';
import { KeyRound, X, AlertCircle } from 'lucide-react';
import { importWalletFromMnemonic } from '../lib/wallet';
import { useTranslation } from 'react-i18next';

interface ImportWalletProps {
  onImport: (wallet: { address: string; privateKey: string; mnemonic: string }) => void;
  onClose: () => void;
  pin: string;
}

export function ImportWallet({ onImport, onClose, pin }: ImportWalletProps) {
  const { t } = useTranslation();
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
      setError(t('error.invalidMnemonic'));
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
          <h2 className="text-xl font-bold">{t('welcome.importWallet')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('account.backupMnemonic')}
            </label>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              className="w-full h-32 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500 p-3"
              placeholder={t('account.enterMnemonic')}
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              {t('common.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}