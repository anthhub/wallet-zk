export interface DappPermission {
  origin: string;
  permissions: {
    viewAddress: boolean;
    sign: boolean;
    viewBalance: boolean;
  };
  approved: boolean;
  timestamp: number;
}

const PERMISSIONS_KEY = 'dapp_permissions';

// 获取所有权限
export function getPermissions(): DappPermission[] {
  const stored = localStorage.getItem(PERMISSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存权限
export function savePermission(permission: DappPermission): void {
  const permissions = getPermissions();
  const index = permissions.findIndex(p => p.origin === permission.origin);
  
  if (index >= 0) {
    permissions[index] = permission;
  } else {
    permissions.push(permission);
  }
  
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
}

// 检查权限
export function checkPermission(origin: string, permissionType: keyof DappPermission['permissions']): boolean {
  const permissions = getPermissions();
  const permission = permissions.find(p => p.origin === origin);
  return permission?.approved && permission.permissions[permissionType] || false;
} 