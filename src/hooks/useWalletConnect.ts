import { useState, useCallback } from "react";
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import type { SessionTypes } from '@walletconnect/types'
import { signTransaction, sendTransaction } from "../lib/transactions";
import { checkPermission } from "../lib/permissions";

interface WalletConnectHookProps {
  address: string | null;
  network: string;
  onPermissionRequest: (origin: string) => Promise<boolean>;
}

export function useWalletConnect({
  address,
  network,
  onPermissionRequest,
}: WalletConnectHookProps) {
  const [web3wallet, setWeb3wallet] = useState<Web3Wallet | null>(null);
  const [connected, setConnected] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [peerMeta, setPeerMeta] = useState<any>(null);
  const [activeSessions, setActiveSessions] = useState<Map<string, SessionTypes.Struct>>(new Map());

  // 初始化 WalletConnect
  const initWallet = useCallback(async () => {
    try {
      const core = new Core({
        projectId: "b479590efeefdf98a5416e8cf2d48ebc"
      });

      const wallet = await Web3Wallet.init({
        core,
        metadata: {
          name: "Web3 Wallet",
          description: "A secure Web3 wallet",
          url: window.location.origin,
          icons: ["https://your-wallet-icon.com"]
        }
      });

      setWeb3wallet(wallet);
      setupEventListeners(wallet);
      return wallet;
    } catch (error) {
      console.error("WalletConnect 初始化失败:", error);
      return null;
    }
  }, []);

  // 设置事件监听
  const setupEventListeners = useCallback((wallet: Web3Wallet) => {
    if (!wallet) return;

    wallet.on("session_proposal", async (proposal) => {
      const { id, params } = proposal;
      
      try {
        // 请求用户授权
        const approved = await onPermissionRequest(params.proposer.metadata.url);
        
        if (approved) {
          const namespaces = buildApprovedNamespaces({
            proposal: params,
            supportedNamespaces: {
              eip155: {
                chains: [`eip155:${network === "mainnet" ? 1 : network === "goerli" ? 5 : 11155111}`],
                methods: [
                  "eth_sendTransaction",
                  "eth_signTransaction",
                  "personal_sign",
                  "eth_sign"
                ],
                events: ["chainChanged", "accountsChanged"],
                accounts: [`eip155:${network === "mainnet" ? 1 : network === "goerli" ? 5 : 11155111}:${address}`]
              }
            }
          });

          const session = await wallet.approveSession({
            id,
            namespaces
          });

          setActiveSessions(prev => new Map(prev.set(session.topic, session)));
          setPeerMeta(params.proposer.metadata);
          setConnected(true);
        } else {
          await wallet.rejectSession({
            id,
            reason: {
              code: 4001,
              message: "用户拒绝连接"
            }
          });
        }
      } catch (error) {
        console.error("处理连接请求失败:", error);
      }
    });

    wallet.on("session_request", async (event) => {
      const { topic, params, id } = event;
      const { request } = params;
      setPendingRequest(true);

      try {
        let result;
        switch (request.method) {
          case "eth_sendTransaction":
            result = await sendTransaction({
              ...request.params[0],
              from: address as `0x${string}`,
              network,
              pin: localStorage.getItem("wallet_pin") || ""
            });
            break;
          case "eth_signTransaction":
            result = await signTransaction({
              ...request.params[0],
              from: address as `0x${string}`,
              network,
              pin: localStorage.getItem("wallet_pin") || ""
            });
            break;
          // 添加其他方法的处理...
        }

        await wallet.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: "2.0",
            result
          }
        });
      } catch (error) {
        await wallet.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: "2.0",
            error: {
              code: 4001,
              message: error instanceof Error ? error.message : "操作失败"
            }
          }
        });
      } finally {
        setPendingRequest(false);
      }
    });

    wallet.on("session_delete", (session) => {
      setActiveSessions(prev => {
        const next = new Map(prev);
        next.delete(session.topic);
        return next;
      });
      if (activeSessions.size === 0) {
        setConnected(false);
        setPeerMeta(null);
      }
    });

    wallet.on("chainChanged", async (chainId: number) => {
      // 更新当前网络
      const network = chainId === 1 ? "mainnet" : 
                     chainId === 5 ? "goerli" : 
                     "sepolia";
                     
      // 更新钱包状态
      setWallet(prev => ({...prev, network}));
      
      // 通知所有活动会话
      for (const [topic, session] of activeSessions) {
        try {
          await wallet.emitSessionEvent({
            topic,
            event: {
              name: "chainChanged",
              data: chainId
            }
          });
        } catch (error) {
          console.error("Failed to notify session of chain change:", error);
        }
      }
      
      // 重新获取余额和资产
      await updateBalance();
    });
  }, [address, network, onPermissionRequest]);

  const connect = useCallback(async () => {
    try {
      const wallet = web3wallet || await initWallet();
      if (!wallet) return;
      
      // 等待 DApp 发起连接请求
      setConnected(true);
    } catch (error) {
      console.error("连接失败:", error);
    }
  }, [web3wallet, initWallet]);

  const disconnect = useCallback(async () => {
    if (!web3wallet) return;
    
    for (const [topic] of activeSessions) {
      await web3wallet.disconnectSession({
        topic,
        reason: {
          code: 6000,
          message: "用户断开连接"
        }
      });
    }
    
    setActiveSessions(new Map());
    setConnected(false);
    setPeerMeta(null);
  }, [web3wallet, activeSessions]);

  return {
    connected,
    pendingRequest,
    peerMeta,
    connect,
    disconnect,
  };
}
