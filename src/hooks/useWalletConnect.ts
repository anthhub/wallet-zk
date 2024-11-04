import { useCallback } from "react";
import { useWalletCore } from "./useWalletCore";
import type { WalletConnectProps } from "../types";

/**
 * WalletConnect 连接管理 Hook
 * 负责处理钱包的连接和断开操作
 */
export function useWalletConnect(props: WalletConnectProps) {
  const {
    web3wallet,
    sessions,
    isConnected,
    initWallet,
    handleSessionEvents
  } = useWalletCore(props);

  /**
   * 连接钱包
   * 1. 初始化 WalletConnect
   * 2. 设置事件监听
   */
  const connect = useCallback(async () => {
    try {
      const wallet = web3wallet || await initWallet();
      if (!wallet) throw new Error("Failed to initialize wallet");
      handleSessionEvents(wallet);
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }, [web3wallet, initWallet, handleSessionEvents]);

  /**
   * 断开钱包连接
   * 1. 断开所有活动会话
   */
  const disconnect = useCallback(async () => {
    if (!web3wallet) return;

    try {
      for (const [topic] of sessions) {
        await web3wallet.disconnectSession({
          topic,
          reason: { code: 6000, message: "User disconnected" }
        });
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
      throw error;
    }
  }, [web3wallet, sessions]);

  return {
    isConnected,
    connect,
    disconnect
  };
}
