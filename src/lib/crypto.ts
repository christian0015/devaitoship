// lib/crypto.ts
import CryptoJS from 'crypto-js';

const CRYPTO_SECRET = process.env.CRYPTO_SECRET!;

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, CRYPTO_SECRET).toString();
};

export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};