import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, X } from 'lucide-react';

interface SendModalProps {
  onClose: () => void;
  onSend: (to: string, amount: string) => Promise<void>;
  balance: bigint;
}

export function SendModal({ onClose, onSend, balance }: SendModalProps) {
  const { t } = useTranslation();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsLoading(true);
      await onSend(to, amount);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '交易失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Send className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold">{t('wallet.send')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('wallet.recipientAddress')}
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('wallet.amount')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border-gray-700 text-white pr-16"
                step="any"
                min="0"
                max={Number(balance)}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ETH
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded-lg transition-colors"
            >
              {isLoading ? t('common.sending') : t('common.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 