import { Send, Download, Scan, History } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AccountManager } from "./AccountManager"
import { QuickActionButton } from "./QuickActionButton"
import { TokenList } from "./TokenList"
import { NFTGrid } from "./NFTGrid"
import { LanguageSelector } from "./LanguageSelector"
import type { WalletState } from "../types/wallet"

interface WalletDashboardProps {
  wallet: WalletState
  onDeleteAccount: () => void
  onViewMnemonic: () => void
  onShowSendModal: () => void
}

export function WalletDashboard({
  wallet,
  onDeleteAccount,
  onViewMnemonic,
  onShowSendModal
}: WalletDashboardProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t("wallet.account")}</h2>
          <LanguageSelector />
        </div>
        <div className="bg-gray-800 rounded-xl p-4 break-all">
          <p className="text-sm text-gray-400 mb-1">{t("wallet.address")}</p>
          <p className="font-mono text-sm">{wallet.address}</p>
        </div>
        <div className="mt-6">
          <p className="text-3xl font-bold">${wallet.balance.toString()} ETH</p>
          <p className="text-sm text-gray-400">{t("wallet.balance")}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <AccountManager
            onDeleteAccount={onDeleteAccount}
            onViewMnemonic={onViewMnemonic}
          />
        </div>
      </div>

      <div className="flex justify-between px-2">
        <QuickActionButton
          icon={Send}
          label="wallet.send"
          onClick={onShowSendModal}
        />
        <QuickActionButton
          icon={Download}
          label="wallet.receive"
          onClick={() => {}} // TODO: Implement receive
        />
        <QuickActionButton
          icon={Scan}
          label="wallet.scan"
          onClick={() => {}} // TODO: Implement scan
        />
        <QuickActionButton
          icon={History}
          label="wallet.history"
          onClick={() => {}} // TODO: Implement history
        />
      </div>

      <div className="bg-gray-900 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">{t("wallet.assets")}</h2>
        <div className="space-y-4">
          <TokenList tokens={wallet.tokens} />
          <NFTGrid nfts={wallet.nfts} />
        </div>
      </div>
    </div>
  )
} 