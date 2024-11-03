import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDKey } from "@scure/bip32";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, goerli, sepolia } from "viem/chains";
import { storeSecureData, getSecureData } from "./crypto";

export const generateWallet = () => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);

  const hdkey = HDKey.fromMasterSeed(seed);
  const childKey = hdkey.derive("m/44'/60'/0'/0/0");

  if (!childKey.privateKey) {
    throw new Error("无法生成私钥");
  }

  const privateKey = Buffer.from(childKey.privateKey).toString("hex");
  const account = privateKeyToAccount(`0x${privateKey}`);

  storeSecureData("mnemonic", mnemonic);
  storeSecureData("privateKey", privateKey);

  return {
    address: account.address,
    privateKey,
    mnemonic,
  };
};

export const importWalletFromMnemonic = (mnemonic: string) => {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  const childKey = hdkey.derive("m/44'/60'/0'/0/0");

  if (!childKey.privateKey) {
    throw new Error("无法生成私钥");
  }

  const privateKey = Buffer.from(childKey.privateKey).toString("hex");
  const account = privateKeyToAccount(`0x${privateKey}`);

  storeSecureData("mnemonic", mnemonic);
  storeSecureData("privateKey", privateKey);

  return {
    address: account.address,
    privateKey,
    mnemonic,
  };
};

export const getStoredWallet = () => {
  const mnemonic = getSecureData("mnemonic");
  const privateKey = getSecureData("privateKey");

  if (!privateKey) return null;

  const account = privateKeyToAccount(`0x${privateKey}`);

  return {
    address: account.address,
    privateKey,
    mnemonic,
  };
};
