import React, { useState } from 'react';
import { Trash2, AlertTriangle, KeyRound } from 'lucide-react';
import { PinVerification } from './PinVerification';

interface AccountManagerProps {
  onDeleteAccount: () => void;
  onViewMnemonic: () => void;
}

export function AccountManager({ onDeleteAccount, onViewMnemonic }: AccountManagerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPinForDelete, setShowPinForDelete] = useState(false);
  const [showPinForMnemonic, setShowPinForMnemonic] = useState(false);

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setShowPinForDelete(true);
  };

  const handlePinVerifiedForDelete = () => {
    setShowPinForDelete(false);
    onDeleteAccount();
  };

  const handleViewMnemonicRequest = () => {
    setShowPinForMnemonic(true);
  };

  const handlePinVerifiedForMnemonic = () => {
    setShowPinForMnemonic(false);
    onViewMnemonic();
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleViewMnemonicRequest}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          <KeyRound className="h-4 w-4" />
          <span>查看助记词</span>
        </button>
        <button
          onClick={handleDeleteRequest}
          className="flex items-center space-x-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span>删除账户</span>
        </button>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex items-start space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-400">删除账户确认</h3>
                <p className="mt-2 text-gray-400">
                  此操作将永久删除您的账户数据。请确保您已经备份了助记词，否则将无法恢复您的账户。
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN验证对话框 - 删除账户 */}
      {showPinForDelete && (
        <PinVerification
          title="验证PIN码"
          message="请输入PIN码以确认删除账户"
          onVerified={handlePinVerifiedForDelete}
          onCancel={() => setShowPinForDelete(false)}
        />
      )}

      {/* PIN验证对话框 - 查看助记词 */}
      {showPinForMnemonic && (
        <PinVerification
          title="验证PIN码"
          message="请输入PIN码以查看助记词"
          onVerified={handlePinVerifiedForMnemonic}
          onCancel={() => setShowPinForMnemonic(false)}
        />
      )}
    </>
  );
} 