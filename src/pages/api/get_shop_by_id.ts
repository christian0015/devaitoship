// src/api/get_shop_data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { findMerchantById } from '../../lib/models/merchantModel';

interface ProductInfo {
  name: string;
  quantity: number;
  dimensions: any;
  shippingAddress: any;
  usedDefaultDims: boolean;
  dimsSource: 'product' | 'merchant' | 'code';
  addressSource: 'product' | 'merchant' | 'code';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // pour test, autorise tout
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // réponse rapide pour preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shopId, slugs } = req.body;
  console.log(shopId, slugs);
  

  if (!shopId || typeof shopId !== 'string') {
    return res.status(400).json({ error: 'shopId manquant ou invalide' });
  }
  if (!Array.isArray(slugs)) {
    return res.status(400).json({ error: 'slugs doit être un tableau (même si un seul)' });
  }

  try {
    await dbConnect();
    const merchant = await findMerchantById(shopId);
    if (!merchant) return res.status(404).json({ error: 'Shop not found' });

    // Préparer adresse et dimensions par défaut
    const merchantAddress = merchant.shippingAddress || {
      name: merchant.merchantName || merchant.shopName,
      street1: '123 Default Street',
      city: 'Paris',
      state: 'IDF',
      zip: '75001',
      country: 'FR'
    };
    const merchantDimensions = merchant.defaultDimensions || {
      length: 20, width: 15, height: 10, weight: 1.5, distance_unit: 'cm', mass_unit: 'kg'
    };

    // Charger les produits demandés
    const productsInfo: ProductInfo[] = [];
    for (const slug of slugs) {
      const p = await fetchProductData(merchant, slug);
      productsInfo.push(p);
    }

    // Réponse
    res.status(200).json({
      shop: {
        id: merchant._id,
        name: merchant.shopName,
        url: merchant.shopUrl,
        address: merchantAddress,
        defaultDimensions: merchantDimensions,
        dimsSource: merchant.defaultDimensions ? 'merchant' : 'code',
        addressSource: merchant.shippingAddress ? 'merchant' : 'code'
      },
      products: productsInfo,
      messages: generateInfoMessages(productsInfo, merchantAddress, merchantDimensions)
    });
  } catch (error: any) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function fetchProductData(merchant: any, slug: string): Promise<ProductInfo> {
  try {
    const decryptedToken = merchant.decryptToken();
    const response = await fetch(`${merchant.shopUrl}/api/products/${slug}`, {
      headers: { 
        Authorization: `Bearer ${decryptedToken}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) throw new Error(`Failed to fetch product ${slug}`);
    const productData = await response.json();

    const dimensions = productData.dimensions || merchant.defaultDimensions || {
      length: 20, width: 15, height: 10, weight: 1.5, distance_unit: 'cm', mass_unit: 'kg'
    };
    const shippingAddress = productData.shippingAddress || merchant.shippingAddress || {
      name: merchant.merchantName || merchant.shopName,
      street1: '123 Default Street',
      city: 'Paris',
      state: 'IDF',
      zip: '75001',
      country: 'FR'
    };

    return {
      name: productData.name || 'Produit inconnu',
      quantity: productData.quantity || 1,
      dimensions,
      shippingAddress,
      usedDefaultDims: !productData.dimensions,
      dimsSource: productData.dimensions ? 'product' : (merchant.defaultDimensions ? 'merchant' : 'code'),
      addressSource: productData.shippingAddress ? 'product' : (merchant.shippingAddress ? 'merchant' : 'code')
    };
  } catch {
    return {
      name: 'Produit non disponible',
      quantity: 1,
      dimensions: merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, distance_unit: 'cm', mass_unit: 'kg'
      },
      shippingAddress: merchant.shippingAddress || {
        name: merchant.merchantName || merchant.shopName,
        street1: '123 Default Street',
        city: 'Paris',
        state: 'IDF',
        zip: '75001',
        country: 'FR'
      },
      usedDefaultDims: true,
      dimsSource: merchant.defaultDimensions ? 'merchant' : 'code',
      addressSource: merchant.shippingAddress ? 'merchant' : 'code'
    };
  }
}

function generateInfoMessages(products: ProductInfo[], address: any, dimensions: any): string[] {
  const msgs = [`Dimensions par défaut: ${dimensions.length}x${dimensions.width}x${dimensions.height}${dimensions.distance_unit}, ${dimensions.weight}${dimensions.mass_unit}`];
  products.forEach((p) => {
    if (p.usedDefaultDims) msgs.push(`Produit "${p.name}": dimensions ${p.dimsSource}`);
    if (p.addressSource !== 'product') msgs.push(`Produit "${p.name}": adresse ${p.addressSource}`);
  });
  return msgs;
}
