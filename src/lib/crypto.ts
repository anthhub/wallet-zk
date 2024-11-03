import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-secure-key'; // In production, use environment variables

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const storeSecureData = (key: string, data: string): void => {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

export const getSecureData = (key: string): string | null => {
  const encryptedData = localStorage.getItem(key);
  if (!encryptedData) return null;
  return decryptData(encryptedData);
};