// src/types/merchant.d.ts
export interface Merchant {
  _id?: string;
  shopUrl: string;
  shopName: string;
  merchantName?: string;
  merchantEmail: string; 
  apiToken: string;
  createdAt: Date;
}