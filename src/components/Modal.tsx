import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function Modal({ 
  title, 
  icon, 
  onClose, 
  children, 
  showCloseButton = true 
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon}
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
} 