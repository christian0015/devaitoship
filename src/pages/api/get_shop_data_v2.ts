// src/api/get_shop_data_v2.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { findMerchantById } from '../../lib/models/merchantModel';

interface ProductInfo {
  id?: number;
  name: string;
  quantity: number;
  dimensions: any;
  shippingAddress: any;
  usedDefaultDims: boolean;
  dimsSource: 'product' | 'merchant' | 'code';
  addressSource: 'product' | 'merchant' | 'code';
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

  const { shopId, slugs, productIds } = req.body;
  console.log({ shopId, slugs, productIds });

  if (!shopId || typeof shopId !== 'string') {
    return res.status(400).json({ error: 'shopId manquant ou invalide' });
  }

  try {
    await dbConnect();
    const merchant = await findMerchantById(shopId);
    if (!merchant) return res.status(404).json({ error: 'Shop not found' });

    // Récupérer les informations de livraison autorisées
    const shippingInfo = await fetchShippingConstraints(merchant);
    
    const productsInfo: ProductInfo[] = [];
    
    if (productIds && productIds.length > 0) {
      // Utiliser les IDs de produits directement
      for (const productId of productIds) {
        const product = await fetchProductById(merchant, productId);
        productsInfo.push(product);
      }
    } else if (slugs && slugs.length > 0) {
      // Utiliser les slugs pour récupérer les IDs d'abord
      for (const slug of slugs) {
        const product = await fetchProductBySlug(merchant, slug);
        productsInfo.push(product);
      }
    }

    res.status(200).json({
      shop: {
        id: merchant._id,
        name: merchant.shopName,
        url: merchant.shopUrl,
        address: merchant.shippingAddress || { // Ajoutez ceci
          name: merchant.merchantName || merchant.shopName,
          street1: '123 Main St',
          city: 'Paris',
          state: 'Île-de-France',
          zip: '75001',
          country: 'FR'
        },
        defaultDimensions: merchant.defaultDimensions,
        shippingConstraints: shippingInfo,
        endpoints: {
          countries: "/api/v1/ecommerce-core/get-countries",
          states: "/api/v1/ecommerce-core/get-states-of-countries",
          cities: "/api/v1/ecommerce-core/get-cities-of-state"
        }
      },
      products: productsInfo
    });
  } catch (error: any) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function fetchShippingConstraints(merchant: any) {
  try {
    const decryptedToken = merchant.decryptToken();
    // Implémenter la logique pour récupérer les contraintes de livraison
    // depuis les APIs du marchand
    return {
      allowedCountries: [],
      allowedStates: {},
      allowedCities: {}
    };
  } catch (error) {
    console.error('Error fetching shipping constraints:', error);
    return {
      allowedCountries: [],
      allowedStates: {},
      allowedCities: {}
    };
  }
}

async function fetchProductById(merchant: any, productId: number): Promise<ProductInfo> {
  try {
    const decryptedToken = merchant.decryptToken();
    
    // Récupérer les infos d'expédition
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

    return {
      id: productId,
      name: 'Produit #' + productId,
      quantity: 1,
      dimensions: shippingData.data[0] || merchant.defaultDimensions,
      shippingAddress: merchant.shippingAddress,
      usedDefaultDims: !shippingData.data[0],
      dimsSource: shippingData.data[0] ? 'product' : 'merchant',
      addressSource: 'merchant'
    };
  } catch (error) {
    return getFallbackProductInfo(merchant);
  }
}

async function fetchProductBySlug(merchant: any, slug: string): Promise<ProductInfo> {
  try {
    const decryptedToken = merchant.decryptToken();
    
    // Récupérer le produit par slug pour obtenir l'ID
    const productResponse = await fetch(
      `${merchant.shopUrl}/api/get-product/${slug}`,
      {
        headers: { 
          Authorization: `Bearer ${decryptedToken}`,
          'Content-Type': 'application/json'
        },
      }
    );

    const productData = await productResponse.json();
    const productId = productData.data.id;

    // Maintenant récupérer les infos d'expédition avec l'ID
    return await fetchProductById(merchant, productId);
  } catch (error) {
    return getFallbackProductInfo(merchant);
  }
}

function getFallbackProductInfo(merchant: any): ProductInfo {
  return {
    name: 'Produit non disponible',
    quantity: 1,
    dimensions: merchant.defaultDimensions || {
      length: 20, width: 15, height: 10, weight: 1.5, 
      distance_unit: 'cm', mass_unit: 'kg'
    },
    shippingAddress: merchant.shippingAddress || {
      name: merchant.merchantName || merchant.shopName,
      street1: '123 Main St',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75001',
      country: 'FR'
    },
    usedDefaultDims: true,
    dimsSource: 'code',
    addressSource: 'code'
  };
}