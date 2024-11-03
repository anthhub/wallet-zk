import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

interface PinVerificationProps {
  title: string;
  message: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function PinVerification({
  title,
  message,
  onVerified,
  onCancel
}: PinVerificationProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('wallet_pin');
    
    if (storedPin === pin) {
      onVerified();
    } else {
      setError('PIN码错误，请重试');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <KeyRound className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="text-gray-400 mb-4">{message}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              PIN码
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 