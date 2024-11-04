import { useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useWalletConnect } from "../hooks/useWalletConnect"
import { TransactionStatus } from "./TransactionStatus"
import { Shield, X } from "lucide-react"
import { useTranslation } from "react-i18next"

interface WalletConnectSessionProps {
  address: string | null
  network: string
  onPermissionRequest: (origin: string) => Promise<boolean>
}

export function WalletConnectSession({ 
  address, 
  network,
  onPermissionRequest 
}: WalletConnectSessionProps) {
  const { t } = useTranslation()
  const { 
    connected,
    pendingRequest,
    peerMeta,
    disconnect
  } = useWalletConnect({
    address,
    network,
    onPermissionRequest
  })

  if (!connected && !peerMeta) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold">
              {connected ? t("wallet.connected") : t("wallet.connecting")}
            </h3>
          </div>
          {connected && (
            <button
              onClick={disconnect}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        
        {peerMeta && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="font-bold">{peerMeta.name}</p>
            <p className="text-sm text-gray-400 mt-1">{peerMeta.description}</p>
            <p className="text-sm text-gray-400 mt-1">{peerMeta.url}</p>
          </div>
        )}
        
        {pendingRequest && (
          <div className="bg-yellow-500/10 text-yellow-500 rounded-lg p-4">
            {t("wallet.pendingRequest")}
          </div>
        )}
      </div>
    </div>
  )
} 