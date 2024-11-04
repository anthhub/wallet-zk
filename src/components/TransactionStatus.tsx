import React from 'react';
import { Check, X, Loader } from 'lucide-react';

interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  error?: string;
}

export function TransactionStatus({ status, hash, error }: TransactionStatusProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          {status === 'pending' && (
            <div className="animate-spin">
              <Loader className="h-8 w-8 text-blue-400" />
            </div>
          )}
          {status === 'confirmed' && (
            <Check className="h-8 w-8 text-green-400" />
          )}
          {status === 'failed' && (
            <X className="h-8 w-8 text-red-400" />
          )}
        </div>
        
        <h3 className="text-lg font-bold text-center mb-2">
          {status === 'pending' && '交易处理中...'}
          {status === 'confirmed' && '交易已确认'}
          {status === 'failed' && '交易失败'}
        </h3>
        
        {hash && (
          <p className="text-sm text-gray-400 text-center break-all">
            交易哈希: {hash}
          </p>
        )}
        
        {error && (
          <p className="text-sm text-red-400 text-center mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
} 