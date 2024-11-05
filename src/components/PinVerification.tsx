import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getSecureData } from "../lib/crypto";

interface PinVerificationProps {
  onVerified: (pin: string) => void;
  onCancel: () => void;
}

export function PinVerification({
  onVerified,
  onCancel,
}: PinVerificationProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    try {
      const decryptedMnemonic = getSecureData("mnemonic", pin);
      if (decryptedMnemonic) {
        onVerified(pin);
      } else {
        setError(t("error.invalidPin"));
      }
    } catch (error) {
      setError(t("error.invalidPin"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{t("transaction.enterPin")}</h3>
        <input
          type="password"
          className="w-full bg-gray-700 rounded p-2 mb-4"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-lg py-2"
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
