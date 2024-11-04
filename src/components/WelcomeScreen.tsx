import { Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSelector } from "./LanguageSelector"

interface WelcomeScreenProps {
  onCreateWallet: () => void
  onStartImport: () => void
}

export function WelcomeScreen({ onCreateWallet, onStartImport }: WelcomeScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">
        <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">{t("welcome.title")}</h2>
        <p className="text-gray-400 mb-6">{t("welcome.subtitle")}</p>

        <div className="flex items-center justify-center mb-6">
          <LanguageSelector />
        </div>

        <button
          onClick={onCreateWallet}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mb-4 transition-colors"
        >
          {t("welcome.createWallet")}
        </button>
        <button
          onClick={onStartImport}
          className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500/10 font-bold py-3 px-4 rounded-xl transition-colors"
        >
          {t("welcome.importWallet")}
        </button>
      </div>
    </div>
  )
} 