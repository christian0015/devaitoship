// pages/api/get_shipping_rates_combined.ts
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

interface CombinedParcel {
  length: number;
  width: number;
  height: number;
  distance_unit: string;
  weight: number;
  mass_unit: string;
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

    // Récupérer les dimensions de tous les produits
    const productInfos = [];
    for (const productReq of products) {
      try {
        const productInfo = await fetchProductById(merchant, productReq.productId);
        productInfos.push({
          ...productInfo,
          quantity: productReq.quantity || 1
        });
      } catch (error) {
        console.error(`Erreur récupération produit ${productReq.productId}:`, error);
      }
    }

    if (productInfos.length === 0) {
      return res.status(400).json({ error: 'Aucun produit valide trouvé' });
    }

    // Combiner tous les produits en un seul colis (comme dans embed.js)
    const combinedParcel = combineProductsIntoParcel(productInfos);
    
    // Obtenir les taux avec le colis combiné
    const rates = await getRates(fromAddress, toAddress, [combinedParcel]);

    res.status(200).json({
      success: true,
      shop: {
        id: merchant._id,
        name: merchant.shopName,
        address: fromAddress
      },
      products: productInfos,
      parcel: combinedParcel,
      rates: rates.map((rate: any) => ({
        id: rate.id,
        object_id: rate.id, // Important pour create-label
        carrier: rate.carrier,
        service: rate.service,
        relayToken: rate.relayToken,
        servicepoint_token: rate.relayToken, // Alias pour compatibilité
        img: rate.img,
        price: rate.price,
        currency: rate.currency,
        estimated_days: rate.estimated_days
      }))
    });
  } catch (error: any) {
    console.error('Error fetching combined shipping rates:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

/**
 * Combine plusieurs produits en un seul colis avec dimensions optimisées
 * Similaire à la logique de embed.js
 */
function combineProductsIntoParcel(products: any[]): CombinedParcel {
  if (products.length === 0) {
    // Dimensions par défaut
    return {
      length: 20,
      width: 15,
      height: 10,
      distance_unit: 'cm',
      weight: 1.5,
      mass_unit: 'kg'
    };
  }

  // Si un seul produit, ajuster selon la quantité
  if (products.length === 1) {
    const product = products[0];
    return calculateAdjustedDimensions(product, product.quantity);
  }

  // Pour plusieurs produits, calculer les dimensions totales
  let totalLength = 0;
  let totalWidth = 0;
  let totalHeight = 0;
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  products.forEach(product => {
    const adjusted = calculateAdjustedDimensions(product, product.quantity);
    
    // Conserver les maximums
    maxLength = Math.max(maxLength, adjusted.length);
    maxWidth = Math.max(maxWidth, adjusted.width);
    maxHeight = Math.max(maxHeight, adjusted.height);
    
    // Additionner pour le volume total
    totalLength += adjusted.length;
    totalWidth += adjusted.width;
    totalHeight += adjusted.height;
    totalWeight += adjusted.weight;
  });

  // Approche de combinaison intelligente
  // On essaie d'optimiser l'espace en empilant intelligemment
  const optimized = optimizeParcelDimensions(
    products.map(p => ({
      ...calculateAdjustedDimensions(p, p.quantity),
      quantity: p.quantity
    }))
  );

  return {
    length: optimized.length || maxLength,
    width: optimized.width || maxWidth,
    height: optimized.height || maxHeight,
    distance_unit: products[0].dimensions?.distance_unit || 'cm',
    weight: totalWeight,
    mass_unit: products[0].dimensions?.mass_unit || 'kg'
  };
}

/**
 * Calcule les dimensions ajustées en fonction de la quantité
 * Identique à la fonction dans embed.js
 */
function calculateAdjustedDimensions(product: any, quantity: number): CombinedParcel {
  const MAX_HEIGHT = 100; // Hauteur maximale en cm
  
  const baseDimensions = product.dimensions || product;
  const baseLength = baseDimensions.length || 20;
  const baseWidth = baseDimensions.width || 15;
  const baseHeight = baseDimensions.height || 10;
  const baseWeight = baseDimensions.weight || 1.5;
  const distanceUnit = baseDimensions.distance_unit || 'cm';
  const massUnit = baseDimensions.mass_unit || 'kg';
  
  let adjustedHeight = baseHeight * quantity;
  let adjustedWidth = baseWidth;
  let adjustedLength = baseLength;
  
  // Si la hauteur dépasse la limite maximale, on répartit sur la largeur
  if (adjustedHeight > MAX_HEIGHT) {
    const stacks = Math.ceil(adjustedHeight / MAX_HEIGHT);
    adjustedHeight = MAX_HEIGHT;
    adjustedWidth = baseWidth * stacks;
  }
  
  return {
    length: adjustedLength,
    width: adjustedWidth,
    height: adjustedHeight,
    distance_unit: distanceUnit,
    weight: baseWeight * quantity /1000,
    mass_unit: massUnit
  };
}

/**
 * Optimise les dimensions pour plusieurs produits
 * Essaye de trouver la meilleure combinaison d'empilement
 */
function optimizeParcelDimensions(parcels: any[]): { length: number; width: number; height: number } {
  if (parcels.length === 0) {
    return { length: 20, width: 15, height: 10 };
  }
  
  if (parcels.length === 1) {
    return parcels[0];
  }
  
  // Trier par volume décroissant
  const sortedParcels = [...parcels].sort((a, b) => {
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeB - volumeA;
  });
  
  // Prendre le plus grand comme base
  let result = { ...sortedParcels[0] };
  
  // Ajouter les autres en optimisant l'espace
  for (let i = 1; i < sortedParcels.length; i++) {
    const parcel = sortedParcels[i];
    
    // Essayer d'ajouter en hauteur
    if (result.length >= parcel.length && result.width >= parcel.width) {
      result.height += parcel.height;
    } 
    // Essayer d'ajouter en largeur
    else if (result.length >= parcel.length && result.height >= parcel.height) {
      result.width += parcel.width;
    }
    // Essayer d'ajouter en longueur
    else if (result.width >= parcel.width && result.height >= parcel.height) {
      result.length += parcel.length;
    }
    // Sinon, agrandir la plus petite dimension
    else {
      // Trouver la dimension la plus restrictive
      const lengthDiff = Math.max(0, parcel.length - result.length);
      const widthDiff = Math.max(0, parcel.width - result.width);
      const heightDiff = Math.max(0, parcel.height - result.height);
      
      // Agrandir la dimension avec la plus petite différence
      const minDiff = Math.min(lengthDiff, widthDiff, heightDiff);
      
      if (minDiff === lengthDiff) {
        result.length = parcel.length;
        result.height += parcel.height;
      } else if (minDiff === widthDiff) {
        result.width = parcel.width;
        result.height += parcel.height;
      } else {
        result.height += parcel.height;
        result.length = Math.max(result.length, parcel.length);
        result.width = Math.max(result.width, parcel.width);
      }
    }
  }
  
  return result;
}

async function fetchProductById(merchant: any, productId: number): Promise<any> {
  try {
    const decryptedToken = merchant.decryptToken?.();
    
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
      productId,
      dimensions: shippingData.data?.[0] || merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  } catch (error) {
    return {
      productId,
      dimensions: merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  }
}