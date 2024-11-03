import React from 'react';
import { Shield, X } from 'lucide-react';
import type { DappPermission } from '../lib/permissions';

interface DappPermissionDialogProps {
  origin: string;
  onApprove: (permissions: DappPermission) => void;
  onReject: () => void;
}

export function DappPermissionDialog({ origin, onApprove, onReject }: DappPermissionDialogProps) {
  const [permissions, setPermissions] = React.useState({
    viewAddress: true,
    sign: false,
    viewBalance: false
  });

  const handleApprove = () => {
    onApprove({
      origin,
      permissions,
      approved: true,
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold">DApp请求连接</h2>
          </div>
          <button onClick={onReject}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-400">
            {origin} 请求以下权限:
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={permissions.viewAddress}
              onChange={(e) => setPermissions(p => ({ ...p, viewAddress: e.target.checked }))}
              className="rounded bg-gray-700 border-gray-600"
            />
            <span>查看钱包地址</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={permissions.sign}
              onChange={(e) => setPermissions(p => ({ ...p, sign: e.target.checked }))}
              className="rounded bg-gray-700 border-gray-600"
            />
            <span>签名交易</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={permissions.viewBalance}
              onChange={(e) => setPermissions(p => ({ ...p, viewBalance: e.target.checked }))}
              className="rounded bg-gray-700 border-gray-600"
            />
            <span>查看余额</span>
          </label>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            拒绝
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            允许
          </button>
        </div>
      </div>
    </div>
  );
} 