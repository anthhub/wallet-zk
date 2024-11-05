import { initCloudStorage } from "@telegram-apps/sdk";

const cloudStorage = initCloudStorage();

export async function storeWalletData({
  mnemonic,
  privateKey,
  address,
}: {
  mnemonic?: string;
  privateKey?: string;
  address?: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // 使用 Promise.all 处理所有存储操作
    Promise.all([
      mnemonic ? cloudStorage.set("mnemonic", mnemonic) : Promise.resolve(),
      privateKey
        ? cloudStorage.set("privateKey", privateKey)
        : Promise.resolve(),
      address ? cloudStorage.set("address", address) : Promise.resolve(),
    ])
      .then(() => resolve())
      .catch(reject);
  });
}

export async function getStoredWalletData(): Promise<{
  mnemonic?: string;
  privateKey?: string;
  address?: string;
} | null> {
  try {
    const [mnemonic, privateKey, address] = await Promise.all([
      cloudStorage.get("mnemonic"),
      cloudStorage.get("privateKey"),
      cloudStorage.get("address"),
    ]);

    if (!mnemonic && !privateKey && !address) {
      return null;
    }

    return { mnemonic, privateKey, address };
  } catch (error) {
    throw new Error(`获取钱包数据失败: ${error}`);
  }
}

export async function clearWalletData(): Promise<void> {
  return cloudStorage.delete(["mnemonic", "privateKey", "address"]);
}
