// src/api/get_shop_by_id/[shopId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongo';
import { findMerchantById } from '../../../lib/models/merchantModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shopId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!shopId || typeof shopId !== 'string') {
    return res.status(400).json({ error: 'Shop ID is required' });
  }

  try {
    await dbConnect();
    
    const merchant = await findMerchantById(shopId);
    
    if (!merchant) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Retourner uniquement les informations nécessaires pour Shippo
    // Sans exposer le token ou autres données sensibles
    const shopData = {
      shopId: merchant._id,
      shopName: merchant.shopName,
      shopUrl: merchant.shopUrl,
      address: merchant.shippingAddress || {
        name: merchant.merchantName || merchant.shopName,
        street1: '123 Default Street',
        city: 'Paris',
        state: 'IDF',
        zip: '75001',
        country: 'FR'
      },
      defaultDims: merchant.defaultDimensions || {
        length: 20,
        width: 15,
        height: 10,
        weight: 1.5,
        distance_unit: 'cm',
        mass_unit: 'kg'
      }
    };

    res.status(200).json(shopData);
  } catch (error: any) {
    console.error('Error fetching shop data:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}