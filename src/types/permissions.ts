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

export interface SignatureRequest {
  id: number;
  method: string;
  params: any[];
  origin: string;
} 