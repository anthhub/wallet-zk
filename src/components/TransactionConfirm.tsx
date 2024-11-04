import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatEther } from 'viem';

interface TransactionConfirmProps {
  transaction: {
    to: string;
    value: bigint;
    data: string;
  };
  origin: string;
  onConfirm: () => void;
  onReject: () => void;
}

// 添加交易详情显示
function TransactionDetails({ transaction }: { transaction: TransactionParams }) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 mb-6">
      <div>
        <p className="text-sm text-gray-400">{t('transaction.to')}</p>
        <p className="font-mono break-all">{transaction.to}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">{t('transaction.amount')}</p>
        <p className="text-xl font-bold">{formatEther(BigInt(transaction.value))} ETH</p>
      </div>
      {transaction.data && transaction.data !== '0x' && (
        <div>
          <p className="text-sm text-gray-400">{t('transaction.data')}</p>
          <p className="font-mono break-all text-sm">{transaction.data}</p>
        </div>
      )}
    </div>
  );
}

export function TransactionConfirm({
  transaction,
  origin,
  onConfirm,
  onReject
}: TransactionConfirmProps) {
  const { t } = useTranslation();
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState('');

  const handleConfirm = async () => {
    try {
      // 验证 PIN 码
      const storedPin = localStorage.getItem('wallet_pin');
      if (pin !== storedPin) {
        setError(t('error.invalidPin'));
        return;
      }
      
      onConfirm();
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">{t('transaction.confirm')}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">{t('transaction.from')}</p>
            <p className="font-mono">{origin}</p>
          </div>

          <TransactionDetails transaction={transaction} />

          {/* PIN 码输入 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t('transaction.enterPin')}
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-2"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 rounded-lg p-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={onReject}
            className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2"
          >
            {t('common.reject')}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-lg py-2"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
} 