import { useEffect, useCallback } from "react"
import { useWalletCore } from "./useWalletCore"
import type { WalletConnectHandlerProps } from "../types"

/**
 * WalletConnect URI 处理 Hook
 * 负责处理来自 DApp 的连接 URI
 */
export function useWalletConnectHandler(props: WalletConnectHandlerProps) {
  const {
    web3wallet,
    initWallet,
    handleSessionEvents
  } = useWalletCore(props)

  /**
   * 处理 WalletConnect URI
   * 1. 验证 URI 格式
   * 2. 处理未连接状态
   * 3. 建立连接
   */
  const handleUri = useCallback(async (uri: string) => {
    // 验证 URI 格式
    if (!uri.startsWith("wc:")) return

    // 如果钱包未连接，保存 URI 并等待连接
    if (!props.wallet.address) {
      localStorage.setItem("pending_wc_uri", uri)
      return
    }

    try {
      // 初始化或获取 WalletConnect 实例
      const wallet = web3wallet || await initWallet()
      if (!wallet) throw new Error("Failed to initialize wallet")

      // 设置事件处理
      handleSessionEvents(wallet)
      
      // 配对连接
      await wallet.pair({ uri })
    } catch (error) {
      console.error("Failed to handle URI:", error)
      throw error
    }
  }, [props.wallet.address, web3wallet, initWallet, handleSessionEvents])

  /**
   * 自动处理 URL 参数中的 URI
   * 1. 检查 URL 参数
   * 2. 处理待处理的 URI
   */
  useEffect(() => {
    // 处理 URL 参数中的 URI
    const params = new URLSearchParams(window.location.search)
    const uri = params.get("wc")
    if (uri) {
      handleUri(uri)
      // 清除 URL 参数
      window.history.replaceState({}, "", window.location.pathname)
    }

    // 处理之前保存的待处理 URI
    const pendingUri = localStorage.getItem("pending_wc_uri")
    if (pendingUri && props.wallet.address) {
      handleUri(pendingUri)
      localStorage.removeItem("pending_wc_uri")
    }
  }, [props.wallet.address, handleUri])

  return { handleUri }
} 