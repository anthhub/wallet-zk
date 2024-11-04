import { useState, useEffect } from "react";
import { generateWallet } from "./lib/wallet";
import { WalletHeader } from "./components/WalletHeader";
import { useTokens } from "./hooks/useTokens";
import { useNFTs } from "./hooks/useNFTs";
import type { WalletState } from "./types/wallet";
import { useTranslation } from "react-i18next";
import { WalletConnectSession } from "./components/WalletConnectSession";
import { LoadingScreen } from "./components/LoadingScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { WalletDashboard } from "./components/WalletDashboard";
import { ModalsContainer } from "./components/ModalsContainer";
import { useWalletStorage } from "./hooks/useWalletStorage";
import { useWalletConnectHandler } from "./hooks/useWalletConnectHandler";

function App() {
  const { t } = useTranslation();
  const storage = useWalletStorage();

  // 初始化钱包状态
  const [wallet, setWallet] = useState<WalletState>(() => {
    const stored = storage.getStoredInfo();
    return {
      address: stored?.address || null,
      privateKey: null,
      mnemonic: null,
      balance: 0n,
      network: stored?.network || "mainnet",
      connected: false,
      tokens: [],
      nfts: [],
    };
  });

  // UI 状态管理
  const [showImport, setShowImport] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [pendingPermission, setPendingPermission] = useState<string | null>(
    null
  );
  const [isInitializing, setIsInitializing] = useState(true);

  // 获取代币和 NFT 数据
  const { tokens } = useTokens(wallet.address, wallet.network);
  const { nfts } = useNFTs(wallet.address, wallet.network);

  // 处理 WalletConnect
  const handlePermissionRequest = async (origin: string) => {
    setPendingPermission(origin);
    return new Promise<boolean>((resolve) => {
      setPendingPermission(origin);
    });
  };

  useWalletConnectHandler(wallet, handlePermissionRequest);

  // 更新代币和 NFT 数据
  useEffect(() => {
    if (tokens) setWallet((prev) => ({ ...prev, tokens }));
  }, [tokens]);

  useEffect(() => {
    if (nfts) setWallet((prev) => ({ ...prev, nfts }));
  }, [nfts]);

  // 初始化检查
  useEffect(() => {
    const init = async () => {
      try {
        const stored = storage.getStoredInfo();
        setIsInitializing(false);
      } catch (error) {
        console.error("初始化钱包失败:", error);
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  // 处理钱包创建
  const handleCreateWallet = () => {
    setIsCreatingWallet(true);
    setShowPinSetup(true);
  };

  // 处理 PIN 设置
  const handlePinSet = (newPin: string) => {
    setPin(newPin);

    if (isCreatingWallet) {
      const newWallet = generateWallet(newPin);
      storage.saveStorage(newWallet.address, wallet.network);

      setWallet((prev) => ({
        ...prev,
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic,
      }));
      setIsCreatingWallet(false);
    }
    setShowPinSetup(false);
  };

  // 其他处理方法...
  const handleImportWallet = (imported: {
    address: string;
    privateKey: string;
    mnemonic: string;
  }) => {
    setWallet((prev) => ({
      ...prev,
      ...imported,
    }));
    setShowImport(false);
  };

  const handleNetworkChange = (network: WalletState["network"]) => {
    setWallet((prev) => ({ ...prev, network }));
  };

  const handleDeleteAccount = () => {
    storage.clearStorage();
    setWallet({
      address: null,
      privateKey: null,
      mnemonic: null,
      balance: 0n,
      network: "mainnet",
      connected: false,
      tokens: [],
      nfts: [],
    });
    setPin(null);
  };

  // 渲染加载状态
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <WalletHeader
        address={wallet.address}
        network={wallet.network}
        onNetworkChange={handleNetworkChange}
        onPermissionRequest={handlePermissionRequest}
      />

      <main className="max-w-md mx-auto px-4 py-6">
        {!wallet.address ? (
          <WelcomeScreen
            onCreateWallet={handleCreateWallet}
            onStartImport={() => setShowImport(true)}
          />
        ) : (
          <WalletDashboard
            wallet={wallet}
            onDeleteAccount={handleDeleteAccount}
            onViewMnemonic={() => setShowMnemonic(true)}
            onShowSendModal={() => setShowSendModal(true)}
          />
        )}

        {/* Modals */}
        <ModalsContainer
          wallet={wallet}
          pin={pin}
          showImport={showImport}
          showMnemonic={showMnemonic}
          showPinSetup={showPinSetup}
          showSendModal={showSendModal}
          pendingPermission={pendingPermission}
          onImport={handleImportWallet}
          onPinSet={handlePinSet}
          onCloseModals={() => {
            setShowImport(false);
            setShowMnemonic(false);
            setShowPinSetup(false);
            setShowSendModal(false);
            setIsCreatingWallet(false);
            setPendingPermission(null);
          }}
        />
      </main>

      <WalletConnectSession
        address={wallet.address}
        network={wallet.network}
        onPermissionRequest={handlePermissionRequest}
      />
    </div>
  );
}

export default App;
