import CryptoJS from "crypto-js";

export interface EncryptedData {
  data: string;
  salt: string;
  iv: string;
}

// 生成随机盐值
function generateSalt(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 从PIN和盐值生成密钥
function deriveKey(pin: string, salt: string): CryptoJS.lib.WordArray {
  const saltWordArray = CryptoJS.enc.Hex.parse(salt);

  return CryptoJS.PBKDF2(pin, saltWordArray, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256,
  });
}

// 生成随机IV
function generateIV(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 加密数据
export function encryptData(data: string, pin: string): EncryptedData {
  const salt = generateSalt();
  const iv = generateIV();
  const key = deriveKey(pin, salt);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    data: encrypted.toString(),
    salt,
    iv,
  };
}

// 解密数据
export function decryptData(encryptedData: EncryptedData, pin: string): string {
  try {
    const key = deriveKey(pin, encryptedData.salt);

    const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
      iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("解密失败:", error);
    throw new Error("解密失败，请检查PIN码是否正确");
  }
}

// 安全存储
export function storeSecureData(key: string, data: string, pin: string): void {
  try {
    const encrypted = encryptData(data, pin);
    localStorage.setItem(key, JSON.stringify(encrypted));
  } catch (error) {
    console.error("存储加密数据失败:", error);
    throw new Error("存储加密数据失败");
  }
}

// 安全读取
export function getSecureData(key: string, pin: string): string | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const encrypted = JSON.parse(stored) as EncryptedData;
    return decryptData(encrypted, pin);
  } catch (error) {
    console.error("读取加密数据失败:", error);
    return null;
  }
}
