// src/api/install.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { Merchant } from '../../types/merchant';
import * as merchantModel from '../../lib/models/merchantModel';
import { z } from 'zod';

const InstallSchema = z.object({
  shopUrl: z.string().url("URL du shop invalide"),
  shopName: z.string().min(1, "Le nom du shop est requis"),
  merchantName: z.string().optional(),
  merchantEmail: z.string().email("Email du marchand invalide"),
  apiToken: z.string().min(20, "Le token API doit contenir au moins 20 caractères")
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await dbConnect(); // Connexion à la base de données
    const result = InstallSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ 
        error: 'Invalid installation data',
        details: result.error.issues 
      });
    }
    const { shopUrl, shopName, merchantName, merchantEmail, apiToken } = req.body as Partial<Merchant>;

    if (!shopUrl) return res.status(422).json({ error: 'shopUrl is required' });

    const existing = await merchantModel.findMerchantByShop(shopUrl);
    if (existing) return res.status(409).json({ error: 'Shop already installed' });

    const newMerchant: Merchant = {
      shopUrl,
      shopName,
      merchantName: merchantName || '',
      merchantEmail,
      apiToken: apiToken || '',
      createdAt: new Date(),
    };

    const insertedId = await merchantModel.createMerchant(newMerchant);

    res.status(201).json({ message: 'Shop installed successfully', merchantId: insertedId, shopUrl, shopName });
  } catch (error: any) {
    console.error('Error install:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
