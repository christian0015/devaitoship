// src/api/integration.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import MerchantModel from '../../lib/models/merchantModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // --- Vérification méthode ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shopUrl } = req.body;
  console.log(shopUrl);
  
  if (!shopUrl || typeof shopUrl !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid shopUrl' });
  }

  try {
    await dbConnect();
    const shop = await MerchantModel.findOne({ shopUrl }).exec();
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    res.status(200).json({ shopId: shop._id.toString() });
  } catch (err: any) {
    console.error('Integration API error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
