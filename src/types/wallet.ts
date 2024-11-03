export interface WalletState {
  address: string | null;
  mnemonic: string | null;
  privateKey: string | null;
  balance: bigint;
  network: 'mainnet' | 'goerli' | 'sepolia';
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