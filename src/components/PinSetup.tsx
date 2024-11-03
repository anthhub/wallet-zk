import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

interface PinSetupProps {
  onPinSet: (pin: string) => void;
  onClose: () => void;
}

export function PinSetup({ onPinSet, onClose }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length < 6) {
      setError('PIN码至少需要6位');
      return;
    }

    if (pin !== confirmPin) {
      setError('两次输入的PIN码不一致');
      return;
    }

    onPinSet(pin);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <KeyRound className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">设置PIN码</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              输入PIN码
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
                minLength={6}
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

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              确认PIN码
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
              minLength={6}
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