import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function QuickActionButton({ icon: Icon, label, onClick }: QuickActionButtonProps) {
  const { t } = useTranslation();
  
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-1/4 p-2"
    >
      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
      <span className="text-sm text-gray-400">{t(label)}</span>
    </button>
  );
} 