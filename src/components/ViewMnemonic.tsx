import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Copy, Check, X, AlertTriangle } from "lucide-react";
import { getSecureData } from "../lib/crypto";

interface ViewMnemonicProps {
  pin: string;
  onClose: () => void;
}

export function ViewMnemonic({ pin, onClose }: ViewMnemonicProps) {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const decryptedMnemonic = getSecureData('mnemonic', pin);
      setMnemonic(decryptedMnemonic);
    } catch (error) {
      console.error('获取助记词失败:', error);
    }
  }, [pin]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <KeyRound className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold">助记词</h2>
          </div>
          <button onClick={onClose}>
            <Eye className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg relative">
            {showMnemonic ? (
              <p className="font-mono break-all">{mnemonic}</p>
            ) : (
              <div className="flex items-center justify-center py-8">
                <button
                  onClick={() => setShowMnemonic(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                  <span>显示助记词</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-400 text-sm">
                警告：请勿将助记词分享给任何人。任何知道您助记词的人都可以完全控制您的钱包。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
