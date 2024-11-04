import type { DappPermission } from "../lib/permissions";

interface DappPermissionDialogProps {
  origin: string;
  metadata: {
    name: string;
    url: string;
  };
  onApprove: (permissions: DappPermission) => void;
  onReject: () => void;
}

export function DappPermissionDialog({
  origin,
  metadata,
  onApprove,
  onReject,
}: DappPermissionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2>连接请求</h2>
        <div>
          <p>{metadata.name}</p>
          <p>{metadata.url}</p>
        </div>
        <div className="flex mt-4">
          <button onClick={onReject}>拒绝</button>
          <button
            onClick={() =>
              onApprove({
                origin,
                permissions: {
                  viewAddress: true,
                  sign: false,
                  viewBalance: false,
                  transactionLimit: "0",
                },
                approved: true,
                timestamp: Date.now(),
              })
            }
          >
            允许
          </button>
        </div>
      </div>
    </div>
  );
}
