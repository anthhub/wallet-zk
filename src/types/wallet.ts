export interface WalletState {
  address: string | null;
  privateKey: string | null;
  mnemonic: string | null;
  balance: bigint;
  network: string;
  connected: boolean;
  tokens: Token[];
  nfts: NFT[];
}

export interface Token {
  address: string;
  symbol: string;
  balance: string;
  decimals: number;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

export interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
  from: string;
}