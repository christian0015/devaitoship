// src/api/get_shipping_rates.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { findMerchantById } from '../../lib/models/merchantModel';
import { getRates } from '../../lib/chippo';

interface ProductRequest {
  productId: number;
  quantity?: number;
}

interface ShippingRate {
  productId: number;
  quantity: number;
  rates: any[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shopId, products, toAddress } = req.body;

  if (!shopId || typeof shopId !== 'string') {
    return res.status(400).json({ error: 'shopId manquant ou invalide' });
  }

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'products doit être un tableau' });
  }

  try {
    await dbConnect();
    const merchant = await findMerchantById(shopId);
    if (!merchant) return res.status(404).json({ error: 'Shop not found' });

    const fromAddress = merchant.shippingAddress || {
      name: merchant.merchantName || merchant.shopName,
      street1: '123 Main St',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75001',
      country: 'FR'
    };

    const results: ShippingRate[] = [];

    for (const productReq of products) {
      try {
        const quantity = productReq.quantity || 1;
        const productInfo = await fetchProductById(merchant, productReq.productId);
        
        const parcel = {
          length: productInfo.dimensions.length,
          width: productInfo.dimensions.width,
          height: productInfo.dimensions.height * quantity,
          weight: productInfo.dimensions.weight * quantity /1000,
          distance_unit: productInfo.dimensions.distance_unit || "cm",
          mass_unit: productInfo.dimensions.mass_unit || "kg"
        };

        const rates = await getRates(fromAddress, toAddress, [parcel]);
        results.push({
          productId: productReq.productId,
          quantity,
          rates: rates
        });
      } catch (error) {
        results.push({
          productId: productReq.productId,
          quantity: productReq.quantity || 1,
          rates: [],
          error: error.message
        });
      }
    }

    res.status(200).json({
      shop: {
        id: merchant._id,
        name: merchant.shopName,
        address: fromAddress
      },
      products: results
    });
  } catch (error: any) {
    console.error('Error fetching shipping rates:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function fetchProductById(merchant: any, productId: number): Promise<any> {
  try {
    const decryptedToken = merchant.decryptToken();
    
    const shippingResponse = await fetch(
      `${merchant.shopUrl}/get-shipping-info/${productId}`,
      {
        headers: { 
          Authorization: `Bearer ${decryptedToken}`,
          'Content-Type': 'application/json'
        },
      }
    );

    const shippingData = await shippingResponse.json();
    console.log("*************shippingData****************");
    console.log("*************",shippingData,"****************");
    console.log("*************shippingData****************");
    
    return {
      dimensions: shippingData.data[0] || merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  } catch (error) {
    return {
      dimensions: merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  }
}