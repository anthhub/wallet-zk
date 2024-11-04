import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <AlertCircle className="h-5 w-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-green-500/10',
    error: 'bg-red-500/10',
    info: 'bg-blue-500/10'
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 ${bgColors[type]} rounded-lg p-4 shadow-lg flex items-center space-x-3 z-50`}>
      {icons[type]}
      <p className="text-sm">{message}</p>
    </div>
  );
} 