export function useWalletStorage() {
  const getStoredInfo = () => {
    try {
      return {
        address: localStorage.getItem("wallet_address"),
        network: localStorage.getItem("wallet_network") || "mainnet",
      };
    } catch (error) {
      console.error("获取存储的钱包信息失败:", error);
      return null;
    }
  };

  const clearStorage = () => {
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_network");
  };

  const saveStorage = (address: string, network: string) => {
    localStorage.setItem("wallet_address", address);
    localStorage.setItem("wallet_network", network);
  };

  return {
    getStoredInfo,
    clearStorage,
    saveStorage,
  };
}
