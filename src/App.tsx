import React, { useState, useEffect } from "react";
import { KeyRound, Shield, Send, Download, Scan, History } from "lucide-react";
import { generateWallet, getStoredWallet } from "./lib/wallet";
import { WalletHeader } from "./components/WalletHeader";
import { TokenList } from "./components/TokenList";
import { NFTGrid } from "./components/NFTGrid";
import { SendTransaction } from "./components/SendTransaction";
import { ImportWallet } from "./components/ImportWallet";
import { useTokens } from "./hooks/useTokens";
import { useNFTs } from "./hooks/useNFTs";
import type { WalletState } from "./types/wallet";
import { ViewMnemonic } from "./components/ViewMnemonic";
import { PinSetup } from "./components/PinSetup";
import { DappPermissionDialog } from "./components/DappPermission";
import { checkPermission, savePermission } from "./lib/permissions";
import { storeSecureData } from "./lib/crypto";
import { AccountManager } from "./components/AccountManager";
import { useTranslation } from "react-i18next";
import { QuickActionButton } from "./components/QuickActionButton";
import { LanguageSelector } from "./components/LanguageSelector";
import type { DappPermission } from "./types/permissions";
import { Loading } from "./components/Loading";
import { Skeleton } from "./components/Skeleton";
import { SendModal } from "./components/SendModal";
import { WalletConnectSession } from "./components/WalletConnectSession";
import { useWalletConnect } from "./hooks/useWalletConnect";

// 新增函数用于获取存储的钱包信息
function getStoredWalletInfo() {
  try {
    const address = localStorage.getItem("wallet_address");
    const publicKey = localStorage.getItem("wallet_public_key");
    
    if (address && publicKey) {
      return {
        address,
        publicKey,
        network: localStorage.getItem("wallet_network") || "mainnet"
      };
    }
    return null;
  } catch (error) {
    console.error("获取存储的钱包信息失败:", error);
    return null;
  }
}

function App() {
  const { t } = useTranslation();
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [wallet, setWallet] = useState<WalletState>(() => {
    // 初始化时检查是否有存储的钱包信息
    const storedWallet = getStoredWalletInfo();
    return {
      address: storedWallet?.address || null,
      publicKey: storedWallet?.publicKey || null,
      privateKey: null, // 私钥不存储在本地
      mnemonic: null,   // 助记词不存储在本地
      balance: 0n,
      network: storedWallet?.network || "mainnet",
      connected: false,
      tokens: [],
      nfts: [],
    };
  });
  const [showImport, setShowImport] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<string | null>(
    null
  );
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const { tokens, loading: tokensLoading } = useTokens(
    wallet.address,
    wallet.network
  );
  const { nfts, loading: nftsLoading } = useNFTs(
    wallet.address,
    wallet.network
  );

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const storedWallet = getStoredWalletInfo();
        if (storedWallet) {
          // 如果有存储的钱包信息,直接展示钱包详情页面
          setIsInitializing(false);
        } else {
          // 没有钱包信息,展示创建钱包页面
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("初始化钱包失败:", error);
        setIsInitializing(false);
      }
    };

    initializeWallet();
  }, []);

  useEffect(() => {
    if (tokens) {
      setWallet((prev) => ({ ...prev, tokens }));
    }
  }, [tokens]);

  useEffect(() => {
    if (nfts) {
      setWallet((prev) => ({ ...prev, nfts }));
    }
  }, [nfts]);

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    setShowPinSetup(true);
  };

  const handlePinSet = (newPin: string) => {
    setPin(newPin);

    if (isCreatingWallet) {
      const newWallet = generateWallet(newPin);
      // 存储公开信息到 localStorage
      localStorage.setItem("wallet_address", newWallet.address);
      localStorage.setItem("wallet_public_key", newWallet.publicKey);
      localStorage.setItem("wallet_network", wallet.network);

      setWallet(prev => ({
        ...prev,
        address: newWallet.address,
        publicKey: newWallet.publicKey,
        privateKey: newWallet.privateKey, // 仅保存在内存中
        mnemonic: newWallet.mnemonic,    // 仅保存在内存中
      }));
      setIsCreatingWallet(false);
    }
    setShowPinSetup(false);
  };

  const handleStartImport = () => {
    if (pin) {
      setShowImport(true);
    } else {
      setShowPinSetup(true);
      setShowImport(true);
    }
  };

  const handleImportWallet = (importedWallet: {
    address: string;
    privateKey: string;
    mnemonic: string;
  }) => {
    setWallet((prev) => ({
      ...prev,
      address: importedWallet.address,
      privateKey: importedWallet.privateKey,
      mnemonic: importedWallet.mnemonic,
    }));
    setShowImport(false);
  };

  const handleNetworkChange = (network: WalletState["network"]) => {
    setWallet((prev) => ({ ...prev, network }));
  };

  const handlePermissionApprove = (permission: DappPermission) => {
    setPendingPermission(null);
    savePermission(permission);
  };

  const handlePermissionRequest = async (origin: string) => {
    setPendingPermission(origin);
    return new Promise<boolean>((resolve) => {
      const handleApprove = (permission: DappPermission) => {
        handlePermissionApprove(permission);
        resolve(true);
      };

      const handleReject = () => {
        setPendingPermission(null);
        resolve(false);
      };

      setPendingPermission(origin);
    });
  };

  const handleDeleteAccount = () => {
    // 清除所有本地存储的钱包信息
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_public_key");
    localStorage.removeItem("wallet_network");

    setWallet({
      address: null,
      publicKey: null,
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

  const handleSendTransaction = async (to: string, amount: string) => {
    try {
      // TODO: 实现发送交易逻辑
      setShowSendModal(false);
    } catch (error) {
      console.error("发送交易失败:", error);
    }
  };

  useEffect(() => {
    // 处理 WalletConnect URI
    const handleWalletConnectUri = (uri: string) => {
      if (uri.startsWith('wc:')) {
        // 如果用户未登录，先保存 URI
        if (!wallet.address) {
          localStorage.setItem('pending_wc_uri', uri);
          return;
        }
        
        // 已登录则直接处理连接请求
        handleWalletConnectSession(uri);
      }
    };

    // 检查 URL 参数中的 WalletConnect URI
    const params = new URLSearchParams(window.location.search);
    const uri = params.get('wc');
    if (uri) {
      handleWalletConnectUri(uri);
    }

    // 检查是否有待处理的连接请求
    const pendingUri = localStorage.getItem('pending_wc_uri');
    if (pendingUri && wallet.address) {
      handleWalletConnectSession(pendingUri);
      localStorage.removeItem('pending_wc_uri');
    }
  }, [wallet.address]);

  const handleWalletConnectSession = async (uri: string) => {
    try {
      const { web3wallet } = useWalletConnect({
        address: wallet.address,
        network: wallet.network,
        onPermissionRequest: handlePermissionRequest
      });

      if (!web3wallet) {
        throw new Error('WalletConnect not initialized');
      }

      // 配对连接
      await web3wallet.pair({ uri });
    } catch (error) {
      console.error('Failed to handle WalletConnect session:', error);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 mx-auto rounded-full" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <div className="pt-4">
                <Skeleton className="h-12 w-full" />
                <div className="h-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Loading size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <WalletHeader
        network={wallet.network}
        onNetworkChange={handleNetworkChange}
      />

      <main className="max-w-md mx-auto px-4 py-6">
        {!wallet.address ? (
          <div className="text-center">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">
              <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t("welcome.title")}</h2>
              <p className="text-gray-400 mb-6">{t("welcome.subtitle")}</p>

              <div className="flex items-center justify-center mb-6">
                <LanguageSelector />
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex justify-center mt-8">
                    <Loading size="lg" />
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleCreateWallet}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mb-4 transition-colors"
                  >
                    {t("welcome.createWallet")}
                  </button>
                  <button
                    onClick={handleStartImport}
                    className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500/10 font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    {t("welcome.importWallet")}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{t("wallet.account")}</h2>
                <LanguageSelector />
              </div>
              <div className="bg-gray-800 rounded-xl p-4 break-all">
                <p className="text-sm text-gray-400 mb-1">
                  {t("wallet.address")}
                </p>
                <p className="font-mono text-sm">{wallet.address}</p>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-bold">
                  ${wallet.balance.toString()} ETH
                </p>
                <p className="text-sm text-gray-400">{t("wallet.balance")}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <AccountManager
                  onDeleteAccount={handleDeleteAccount}
                  onViewMnemonic={() => setShowMnemonic(true)}
                />
              </div>
            </div>

            <div className="flex justify-between px-2">
              <QuickActionButton
                icon={Send}
                label="wallet.send"
                onClick={() => setShowSendModal(true)}
              />
              <QuickActionButton
                icon={Download}
                label="wallet.receive"
                onClick={() => setShowReceiveModal(true)}
              />
              <QuickActionButton
                icon={Scan}
                label="wallet.scan"
                onClick={() => setShowScanModal(true)}
              />
              <QuickActionButton
                icon={History}
                label="wallet.history"
                onClick={() => setShowHistoryModal(true)}
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
        )}

        {showImport && pin && (
          <ImportWallet
            onImport={handleImportWallet}
            onClose={() => setShowImport(false)}
            pin={pin}
          />
        )}

        {showMnemonic && pin && (
          <ViewMnemonic pin={pin} onClose={() => setShowMnemonic(false)} />
        )}

        {showPinSetup && (
          <PinSetup
            onPinSet={handlePinSet}
            onClose={() => {
              setShowPinSetup(false);
              setIsCreatingWallet(false);
              setShowImport(false);
            }}
          />
        )}

        {pendingPermission && (
          <DappPermissionDialog
            origin={pendingPermission}
            onApprove={handlePermissionApprove}
            onReject={() => setPendingPermission(null)}
          />
        )}

        {showSendModal && (
          <SendModal
            onClose={() => setShowSendModal(false)}
            onSend={handleSendTransaction}
            balance={wallet.balance}
          />
        )}

        {showReceiveModal && (
          <ReceiveModal
            address={wallet.address}
            onClose={() => setShowReceiveModal(false)}
          />
        )}

        {showScanModal && (
          <ScanModal
            onScan={(result) => {
              // TODO: 处理扫描结果
              setShowScanModal(false);
            }}
            onClose={() => setShowScanModal(false)}
          />
        )}

        {showHistoryModal && (
          <HistoryModal
            address={wallet.address}
            network={wallet.network}
            onClose={() => setShowHistoryModal(false)}
          />
        )}
      </main>

      {/* {(tokensLoading || nftsLoading) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Loading size="lg" />
            <p className="mt-4 text-gray-400">{t("common.loading")}</p>
          </div>
        </div>
      )} */}
      <WalletConnectSession
        address={wallet.address}
        network={wallet.network}
        onPermissionRequest={handlePermissionRequest}
      />
    </div>
  );
}

export default App;
