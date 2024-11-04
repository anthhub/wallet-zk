import React, { useState } from 'react';
import { KeyRound, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PinVerification } from './PinVerification';

interface AccountManagerProps {
  onDeleteAccount: () => void;
  onViewMnemonic: () => void;
}

export function AccountManager({ onDeleteAccount, onViewMnemonic }: AccountManagerProps) {
  const { t } = useTranslation();
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
          <span>{t('account.viewMnemonic')}</span>
        </button>
        <button
          onClick={handleDeleteRequest}
          className="flex items-center space-x-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t('account.deleteAccount')}</span>
        </button>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-md p-6">
            <div className="flex items-start space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-400">
                  {t('account.deleteConfirm')}
                </h3>
                <p className="mt-2 text-gray-400">
                  {t('account.deleteWarning')}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN验证对话框 */}
      {showPinForDelete && (
        <PinVerification
          title={t('account.verifyPin')}
          message={t('account.enterPinDelete')}
          onVerified={handlePinVerifiedForDelete}
          onCancel={() => setShowPinForDelete(false)}
        />
      )}

      {showPinForMnemonic && (
        <PinVerification
          title={t('account.verifyPin')}
          message={t('account.enterPinMnemonic')}
          onVerified={handlePinVerifiedForMnemonic}
          onCancel={() => setShowPinForMnemonic(false)}
        />
      )}
    </>
  );
} 