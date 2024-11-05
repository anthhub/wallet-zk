import { create } from "zustand";
import { ethers } from "ethers";
import {
  getStoredWalletData,
  storeWalletData,
  clearWalletData,
} from "../lib/wallet-storage";

interface WalletState {
  address: string | null;
  isInitialized: boolean;
  isLoading: boolean;

  initWallet: () => Promise<void>;
  importWallet: (mnemonic: string) => Promise<void>;
  clearWallet: () => Promise<void>;
  getPrivateKey: () => Promise<string | null>;
}

export const useWallet = create<WalletState>((set) => ({
  address: null,
  isInitialized: false,
  isLoading: false,

  initWallet: async () => {
    try {
      set({ isLoading: true });
      const data = await getStoredWalletData();

      if (data?.address) {
        set({
          address: data.address,
          isInitialized: true,
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  importWallet: async (mnemonic: string) => {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    await storeWalletData({
      mnemonic,
      privateKey: wallet.privateKey,
      address: wallet.address,
    });

    set({
      address: wallet.address,
      isInitialized: true,
    });
  },

  clearWallet: async () => {
    await clearWalletData();
    set({
      address: null,
      isInitialized: false,
    });
  },

  getPrivateKey: async () => {
    const data = await getStoredWalletData();
    return data?.privateKey || null;
  },
}));
