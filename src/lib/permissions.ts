import { encrypt, decrypt } from './crypto';

export interface DappPermission {
  origin: string;
  permissions: {
    viewAddress: boolean;
    sign: boolean;
    viewBalance: boolean;
    transactionLimit: string;
  };
  approved: boolean;
  timestamp: number;
}

const PERMISSIONS_KEY = 'dapp_permissions';

// 获取所有权限
export function getPermissions(): DappPermission[] {
  const stored = localStorage.getItem(PERMISSIONS_KEY);
  if (!stored) return [];
  
  try {
    const decrypted = decrypt(stored, localStorage.getItem("wallet_pin") || "");
    return JSON.parse(decrypted);
  } catch {
    return [];
  }
}

// 检查权限
export function checkPermission(origin: string, permissionType: keyof DappPermission['permissions'], amount?: string): boolean {
  const permissions = getPermissions();
  const permission = permissions.find(p => p.origin === origin);
  
  if (!permission?.approved) return false;
  
  if (permissionType === 'sign' && amount) {
    const limit = BigInt(permission.permissions.transactionLimit || '0');
    if (limit > 0n && BigInt(amount) > limit) {
      return false;
    }
  }
  
  return permission.permissions[permissionType] || false;
}

// 保存权限时加密存储
export function savePermission(permission: DappPermission): void {
  const permissions = getPermissions();
  const index = permissions.findIndex(p => p.origin === permission.origin);
  
  if (index >= 0) {
    permissions[index] = permission;
  } else {
    permissions.push(permission);
  }
  
  const encrypted = encrypt(JSON.stringify(permissions), localStorage.getItem("wallet_pin") || "");
  localStorage.setItem(PERMISSIONS_KEY, encrypted);
} 