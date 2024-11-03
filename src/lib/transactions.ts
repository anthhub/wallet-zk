import { createWalletClient, http, parseEther, type TransactionRequest } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, goerli, sepolia } from 'viem/chains';
import { getSecureData } from './crypto';

const getChainConfig = (network: string) => {
  switch (network) {
    case 'mainnet':
      return mainnet;
    case 'goerli':
      return goerli;
    case 'sepolia':
      return sepolia;
    default:
      return mainnet;
  }
};

interface SignTransactionParams {
  to: `0x${string}`;
  value: bigint;
  from: `0x${string}`;
  network: string;
}

export const signTransaction = async ({
  to,
  value,
  from,
  network,
}: SignTransactionParams) => {
  const privateKey = getSecureData('privateKey');
  if (!privateKey) {
    throw new Error('Private key not found');
  }

  const account = privateKeyToAccount(`0x${privateKey}`);
  const chain = getChainConfig(network);

  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const nonce = await client.getTransactionCount({ address: from });
  const gasPrice = await client.getGasPrice();
  const gasLimit = await client.estimateGas({
    account,
    to,
    value,
    nonce,
  });

  const transaction: TransactionRequest = {
    to,
    value,
    from,
    nonce,
    gasPrice,
    gas: gasLimit,
  };

  const hash = await client.sendTransaction(transaction);
  return hash;
};