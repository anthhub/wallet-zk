import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-700/50 hover:bg-gray-600/50"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm">{i18n.language.toUpperCase()}</span>
    </button>
  );
} 