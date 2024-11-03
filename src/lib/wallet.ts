import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDKey } from "@scure/bip32";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, goerli, sepolia } from "viem/chains";
import { storeSecureData, getSecureData } from "./crypto";

export const generateWallet = (pin: string) => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);

  const hdkey = HDKey.fromMasterSeed(seed);
  const childKey = hdkey.derive("m/44'/60'/0'/0/0");

  if (!childKey.privateKey) {
    throw new Error("无法生成私钥");
  }

  const privateKey = Buffer.from(childKey.privateKey).toString("hex");
  const account = privateKeyToAccount(`0x${privateKey}`);

  storeSecureData("mnemonic", mnemonic, pin);
  storeSecureData("privateKey", privateKey, pin);

  return {
    address: account.address,
    privateKey,
    mnemonic,
  };
};

export const importWalletFromMnemonic = (mnemonic: string, pin: string) => {
  try {
    if (!mnemonic || !pin) {
      throw new Error("助记词和PIN码不能为空");
    }

    // 验证助记词格式
    const words = mnemonic.trim().split(' ');
    if (words.length !== 12 && words.length !== 24) {
      throw new Error("助记词必须是12个或24个单词");
    }

    const seed = mnemonicToSeedSync(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const childKey = hdkey.derive("m/44'/60'/0'/0/0");

    if (!childKey.privateKey) {
      throw new Error("无法生成私钥");
    }

    const privateKey = Buffer.from(childKey.privateKey).toString("hex");
    const account = privateKeyToAccount(`0x${privateKey}`);

    // 存储加密的助记词和私钥
    storeSecureData("mnemonic", mnemonic, pin);
    storeSecureData("privateKey", privateKey, pin);

    return {
      address: account.address,
      privateKey,
      mnemonic,
    };
  } catch (error) {
    console.error("导入钱包失败:", error);
    throw new Error(error instanceof Error ? error.message : "导入钱包失败");
  }
};

export const getStoredWallet = (pin: string) => {
  const mnemonic = getSecureData("mnemonic", pin);
  const privateKey = getSecureData("privateKey", pin);

  if (!mnemonic || !privateKey) {
    return null;
  }

  const account = privateKeyToAccount(`0x${privateKey}`);

  return {
    address: account.address,
    privateKey,
    mnemonic,
  };
};
