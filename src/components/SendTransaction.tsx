import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { parseEther, formatEther } from 'viem';
import { signTransaction } from '../lib/transactions';

interface SendTransactionProps {
  address: string;
  balance: bigint;
  network: string;
}

export function SendTransaction({ address, balance, network }: SendTransactionProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const value = parseEther(amount);
      if (value > balance) {
        throw new Error('Insufficient balance');
      }

      const tx = await signTransaction({
        to: recipient as `0x${string}`,
        value,
        from: address as `0x${string}`,
        network,
      });

      setRecipient('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Send ETH</h2>
        <Send className="h-5 w-5 text-gray-400" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-400">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            placeholder="0x..."
            required
            pattern="^0x[a-fA-F0-9]{40}$"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
            Amount (ETH)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500 pr-16"
              placeholder="0.0"
              step="0.000000000000000001"
              min="0"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">ETH</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Available: {formatEther(balance)} ETH
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-900/50 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Signing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}