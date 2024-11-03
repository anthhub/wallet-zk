import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Copy, Check, X } from "lucide-react";
import { getSecureData } from "../lib/crypto";

interface ViewMnemonicProps {
  onClose: () => void;
}

export function ViewMnemonic({ onClose }: ViewMnemonicProps) {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copied, setCopied] = useState(false);

  const mnemonic = getSecureData("mnemonic");

  const handleCopy = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <KeyRound className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">助记词</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            {showMnemonic ? (
              <p className="font-mono text-sm break-all">{mnemonic}</p>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <p className="text-gray-400">点击下方按钮显示助记词</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4"
            >
              {showMnemonic ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>隐藏助记词</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>显示助记词</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              disabled={!showMnemonic}
              className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2 px-4"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>复制</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              警告：请勿将助记词分享给任何人。任何知道您助记词的人都可以完全控制您的钱包。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
