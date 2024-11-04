import { useState, useCallback } from "react"
import type { IWeb3Wallet } from "@walletconnect/web3wallet"
import type { SessionTypes } from "@walletconnect/types"
import { 
  initializeWeb3Wallet, 
  getChainData, 
  buildNamespaces 
} from "../lib/walletconnect/core"

interface WalletCoreProps {
  address: string | null                              // 钱包地址
  network: "mainnet" | "goerli" | "sepolia"          // 网络类型
  onPermissionRequest: (origin: string) => Promise<boolean>  // 权限请求处理
  onNetworkChange?: (network: string) => void        // 网络变更处理
}

/**
 * WalletConnect 核心 Hook
 * 负责管理钱包连接状态、会话管理和事件处理
 */
export function useWalletCore(props: WalletCoreProps) {
  // 核心状态管理
  const [web3wallet, setWeb3wallet] = useState<IWeb3Wallet | null>(null)  // WalletConnect 实例
  const [sessions, setSessions] = useState<Map<string, SessionTypes.Struct>>(new Map())  // 活动会话
  const [isConnected, setIsConnected] = useState(false)  // 连接状态

  /**
   * 初始化 WalletConnect 实例
   * 1. 检查是否已初始化
   * 2. 创建新实例
   * 3. 恢复现有会话
   */
  const initWallet = useCallback(async () => {
    if (web3wallet) return web3wallet

    const wallet = await initializeWeb3Wallet({
      name: "Web3 Wallet",
      description: "A secure Web3 wallet",
      url: process.env.NEXT_PUBLIC_WALLET_URL || window.location.origin,
      icons: ["https://your-wallet-icon.png"]
    })

    if (wallet) {
      setWeb3wallet(wallet)
      // 恢复现有会话
      const existingSessions = wallet.getActiveSessions()
      if (existingSessions) {
        setSessions(new Map(Object.entries(existingSessions)))
        setIsConnected(true)
      }
    }
    return wallet
  }, [web3wallet])

  /**
   * 处理所有 WalletConnect 会话相关事件
   * 包括：会话提议、请求处理、会话删除和网络变更
   */
  const handleSessionEvents = useCallback((wallet: IWeb3Wallet) => {
    // 1. 处理会话提议（DApp 发起连接请求）
    wallet.on("session_proposal", async (proposal) => {
      const { id, params } = proposal
      try {
        // 请求用户授权
        const approved = await props.onPermissionRequest(params.proposer.metadata.url)
        if (!approved) {
          await wallet.rejectSession({
            id,
            reason: { code: 4001, message: "User rejected" }
          })
          return
        }

        // 准备会话参数
        const { chainId, namespace } = getChainData(props.network)
        const account = `${namespace}:${props.address}`
        const namespaces = buildNamespaces(namespace, account)

        // 批准会话
        const session = await wallet.approveSession({ id, namespaces })
        setSessions(prev => new Map(prev).set(session.topic, session))
        setIsConnected(true)
      } catch (error) {
        console.error("Session proposal failed:", error)
        await wallet.rejectSession({
          id,
          reason: { code: 5000, message: "Session approval failed" }
        })
      }
    })

    // 2. 处理会话请求（签名、交易等）
    wallet.on("session_request", async ({ topic, params, id }) => {
      const { request } = params
      const session = sessions.get(topic)
      if (!session) return

      try {
        let result
        switch (request.method) {
          case "eth_sendTransaction":
            // TODO: 实现交易发送
            break
          case "eth_signTransaction":
            // TODO: 实现交易签名
            break
          case "personal_sign":
            // TODO: 实现消息签名
            break
          default:
            throw new Error("Unsupported method")
        }

        await wallet.respondSessionRequest({
          topic,
          response: { id, result, jsonrpc: "2.0" }
        })
      } catch (error) {
        await wallet.respondSessionRequest({
          topic,
          response: {
            id,
            error: { code: 5000, message: "Request failed" },
            jsonrpc: "2.0"
          }
        })
      }
    })

    // 3. 处理会话删除（断开连接）
    wallet.on("session_delete", ({ topic }) => {
      setSessions(prev => {
        const next = new Map(prev)
        next.delete(topic)
        return next
      })
      if (sessions.size === 0) {
        setIsConnected(false)
      }
    })

    // 4. 处理网络变更
    wallet.on("session_event", ({ params }) => {
      const { event } = params
      if (event.name === "chainChanged" && props.onNetworkChange) {
        const chainId = Number(event.data)
        const newNetwork = 
          chainId === 1 ? "mainnet" : 
          chainId === 5 ? "goerli" : 
          "sepolia"
        props.onNetworkChange(newNetwork)
      }
    })
  }, [props, sessions])

  return {
    web3wallet,
    sessions,
    isConnected,
    initWallet,
    handleSessionEvents
  }
} 