import React, { useState, useEffect } from "react";
import { KeyRound, Shield } from "lucide-react";
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

function App() {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    mnemonic: null,
    privateKey: null,
    balance: 0n,
    network: "mainnet",
    connected: false,
    tokens: [],
    nfts: [],
  });
  const [showImport, setShowImport] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<string | null>(
    null
  );
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const { tokens, loading: tokensLoading } = useTokens(
    wallet.address,
    wallet.network
  );
  const { nfts, loading: nftsLoading } = useNFTs(
    wallet.address,
    wallet.network
  );

  useEffect(() => {
    const storedPin = localStorage.getItem("wallet_pin");
    if (storedPin) {
      setPin(storedPin);
      const storedWallet = getStoredWallet(storedPin);
      if (storedWallet) {
        setWallet((prev) => ({
          ...prev,
          address: storedWallet.address,
          privateKey: storedWallet.privateKey,
          mnemonic: storedWallet.mnemonic,
        }));
      }
    }
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

  const handleCreateWallet = () => {
    setIsCreatingWallet(true);
    setShowPinSetup(true);
  };

  const handlePinSet = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem("wallet_pin", newPin);

    if (isCreatingWallet) {
      const newWallet = generateWallet(newPin);
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

  const handlePermissionRequest = (origin: string) => {
    if (!checkPermission(origin, "viewAddress")) {
      setPendingPermission(origin);
    }
  };

  const handlePermissionApprove = (permission: DappPermission) => {
    savePermission(permission);
    setPendingPermission(null);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("mnemonic");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("has_pin");
    localStorage.removeItem("wallet_pin");

    setWallet({
      address: null,
      mnemonic: null,
      privateKey: null,
      balance: 0n,
      network: "mainnet",
      connected: false,
      tokens: [],
      nfts: [],
    });
    setPin(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <WalletHeader
        network={wallet.network}
        onNetworkChange={handleNetworkChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!wallet.address ? (
          <div className="text-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto">
              <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">欢迎使用 Web3 钱包</h2>
              <p className="text-gray-400 mb-6">创建或导入钱包开始使用</p>
              <button
                onClick={handleCreateWallet}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                创建新钱包
              </button>
              <button
                onClick={handleStartImport}
                className="w-full mt-4 border border-blue-500 text-blue-500 hover:bg-blue-500/10 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                导入已有钱包
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Account</h2>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="text-sm text-gray-400">Connected</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 break-all">
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <p className="font-mono">{wallet.address}</p>
              </div>
              <div className="mt-4">
                <div>
                  <p className="text-2xl font-bold">
                    {wallet.balance.toString()} ETH
                  </p>
                  <p className="text-sm text-gray-400">Balance</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">账户</h2>
                <AccountManager
                  onDeleteAccount={handleDeleteAccount}
                  onViewMnemonic={() => setShowMnemonic(true)}
                />
              </div>
              {/* 其他钱包信息... */}
            </div>

            <SendTransaction
              address={wallet.address}
              balance={wallet.balance}
              network={wallet.network}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenList tokens={wallet.tokens} />
              <NFTGrid nfts={wallet.nfts} />
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
      </main>
    </div>
  );
}

export default App;
