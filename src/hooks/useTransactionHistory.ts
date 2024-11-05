import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useTransactionHistory(address: string | null, network: string) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
        const provider = new ethers.JsonRpcProvider(
          `https://${network}.g.alchemy.com/v2/${ALCHEMY_KEY}`
        );

        const block = await provider.getBlockNumber();
        const txs = await provider.getHistory(address, block - 100, block);
        setTransactions(txs);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address, network]);

  return { transactions, loading };
}
