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
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const { shopId, products, toAddress } = req.body;

  // VALIDATION RENFORCÉE
  if (!shopId || typeof shopId !== 'string' || shopId.length < 10) {
    return res.status(400).json({ 
      success: false,
      error: 'shopId manquant ou invalide. Doit être un ID MongoDB valide.',
      code: 'INVALID_SHOP_ID'
    });
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ 
      success: false,
      error: 'products doit être un tableau non vide',
      code: 'INVALID_PRODUCTS_FORMAT'
    });
  }

  console.log(`🚀 Début traitement COMBINÉ pour ${products.length} produits (shopId: ${shopId})`);

  try {
    await dbConnect();
    
    // Récupérer le marchand
    const merchant = await findMerchantById(shopId);
    
    if (!merchant) {
      console.error(`❌ Marchand non trouvé: ${shopId}`);
      return res.status(404).json({ 
        success: false,
        error: 'Shop not found',
        code: 'SHOP_NOT_FOUND'
      });
    }

    const fromAddress = merchant.shippingAddress || {
      name: merchant.merchantName || merchant.shopName,
      street1: '123 Main St',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75001',
      country: 'FR'
    };

    // Récupérer la clé API du client
    const clientApiKey = merchant.getShippoApiKey ? merchant.getShippoApiKey() : null;
    
    // Incrémenter le compteur d'estimations (une seule fois pour le colis combiné)
    let estimationCount = 0;
    try {
      if (merchant.incrementEstimationCount) {
        estimationCount = await merchant.incrementEstimationCount();
        console.log(`📊 Estimation count for client ${shopId}: ${estimationCount} (last 2 months)`);
      }
    } catch (estimationError) {
      console.warn(`⚠️ Erreur comptage estimations:`, estimationError);
    }

    const startTime = Date.now();

    // Récupérer les dimensions de tous les produits en parallèle
    const productInfos = [];
    const productPromises = products.map(async (productReq) => {
      try {
        const productInfo = await fetchProductById(merchant, productReq.productId);
        return {
          ...productInfo,
          quantity: productReq.quantity || 1,
          productId: productReq.productId
        };
      } catch (error) {
        console.error(`❌ Erreur récupération produit ${productReq.productId}:`, error);
        return null;
      }
    });

    const productResults = await Promise.all(productPromises);
    
    // Filtrer les produits valides
    productInfos.push(...productResults.filter(Boolean));

    if (productInfos.length === 0) {
      console.error(`❌ Aucun produit valide pour shopId: ${shopId}`);
      return res.status(400).json({ 
        success: false,
        error: 'Aucun produit valide trouvé',
        code: 'NO_VALID_PRODUCTS',
        details: 'Impossible de récupérer les dimensions des produits'
      });
    }

    console.log(`✅ ${productInfos.length}/${products.length} produits récupérés avec succès`);

    // Combiner tous les produits en un seul colis
    const combinedParcel = combineProductsIntoParcel(productInfos);
    console.log(`📦 Colis combiné créé:`, {
      dimensions: `${combinedParcel.length}x${combinedParcel.width}x${combinedParcel.height} ${combinedParcel.distance_unit}`,
      weight: `${combinedParcel.weight} ${combinedParcel.mass_unit}`
    });

    // Obtenir les taux avec le colis combiné
    const rates = await getRates(fromAddress, toAddress, [combinedParcel], undefined, clientApiKey);

    const processingTime = Date.now() - startTime;
    console.log(`✅ Traitement combiné terminé en ${processingTime}ms`);

    // Préparer la réponse
    const hasRates = rates && rates.length > 0;

    res.status(hasRates ? 200 : 404).json({
      success: hasRates,
      shop: {
        id: merchant._id,
        name: merchant.shopName,
        address: fromAddress,
        apiKeyInfo: {
          hasClientKey: !!clientApiKey,
          keyLength: clientApiKey?.length || 0,
          source: clientApiKey ? 'client' : 'default'
        },
        estimationStats: merchant.getEstimationStats ? merchant.getEstimationStats() : null
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
        estimated_days: rate.estimated_days,
        apiKeySource: rate.apiKeySource // Ajout de la source de la clé
      })),
      metadata: {
        totalProducts: productInfos.length,
        combinedShipment: true,
        processingTimeMs: processingTime,
        clientEstimationCount: estimationCount,
        parcelDimensions: {
          length: combinedParcel.length,
          width: combinedParcel.width,
          height: combinedParcel.height,
          weight: combinedParcel.weight,
          unit: combinedParcel.distance_unit,
          volume: combinedParcel.length * combinedParcel.width * combinedParcel.height
        },
        rateLimitInfo: {
          plan: merchant.plan,
          monthlyLimit: merchant.plan === 'free' ? 100 : 1000,
          usedThisMonth: estimationCount
        }
      },
      ...(!hasRates ? {
        warning: 'Aucun tarif disponible pour cette combinaison d\'adresses et de colis',
        suggestions: [
          'Vérifiez les adresses de départ et d\'arrivée',
          'Vérifiez les dimensions et le poids du colis',
          'Contactez le support si le problème persiste'
        ]
      } : {})
    });
  } catch (error: any) {
    console.error('❌ Error fetching combined shipping rates:', error);
    
    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'Internal server error';
    
    if (error.message?.includes('CLIENT_API_KEY_INVALID')) {
      statusCode = 401;
      errorCode = 'CLIENT_API_KEY_INVALID';
      errorMessage = 'La clé API Shippo du client est invalide ou expirée';
    } else if (error.message?.includes('SHIPPO_API_ERROR')) {
      statusCode = 502;
      errorCode = 'SHIPPO_API_ERROR';
      errorMessage = 'Erreur de communication avec l\'API Shippo';
    } else if (error.message?.includes('Cast to ObjectId failed')) {
      statusCode = 400;
      errorCode = 'INVALID_SHOP_ID_FORMAT';
      errorMessage = 'Format d\'ID de boutique invalide. Doit être un ObjectId MongoDB.';
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      code: errorCode,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Combine plusieurs produits en un seul colis avec dimensions optimisées
 */
function combineProductsIntoParcel(products: any[]): CombinedParcel {
  if (products.length === 0) {
    console.warn('⚠️ Aucun produit à combiner, utilisation des dimensions par défaut');
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
    const result = calculateAdjustedDimensions(product, product.quantity);
    console.log(`📏 Un seul produit: ${result.length}x${result.width}x${result.height}cm`);
    return result;
  }

  console.log(`🔗 Combinaison de ${products.length} produits en un seul colis`);

  let totalLength = 0;
  let totalWidth = 0;
  let totalHeight = 0;
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  products.forEach(product => {
    const adjusted = calculateAdjustedDimensions(product, product.quantity);
    
    maxLength = Math.max(maxLength, adjusted.length);
    maxWidth = Math.max(maxWidth, adjusted.width);
    maxHeight = Math.max(maxHeight, adjusted.height);
    
    totalLength += adjusted.length;
    totalWidth += adjusted.width;
    totalHeight += adjusted.height;
    totalWeight += adjusted.weight;
  });

  const optimized = optimizeParcelDimensions(
    products.map(p => ({
      ...calculateAdjustedDimensions(p, p.quantity),
      quantity: p.quantity
    }))
  );

  const finalParcel = {
    length: optimized.length || maxLength,
    width: optimized.width || maxWidth,
    height: optimized.height || maxHeight,
    distance_unit: products[0].dimensions?.distance_unit || 'cm',
    weight: totalWeight,
    mass_unit: products[0].dimensions?.mass_unit || 'kg'
  };

  console.log(`📐 Colis optimisé: ${finalParcel.length}x${finalParcel.width}x${finalParcel.height}cm, poids: ${finalParcel.weight}kg`);
  return finalParcel;
}

/**
 * Calcule les dimensions ajustées en fonction de la quantité
 */
function calculateAdjustedDimensions(product: any, quantity: number): CombinedParcel {
  const MAX_HEIGHT = 100;
  
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
    console.log(`📐 Produit ${product.productId}: hauteur ajustée (${stacks} piles)`);
  }
  
  return {
    length: adjustedLength,
    width: adjustedWidth,
    height: adjustedHeight,
    distance_unit: distanceUnit,
    weight: baseWeight * quantity / 1000,
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
  
  console.log(`🧮 Optimisation dimensionnelle (${sortedParcels.length} colis)`);
  
  // Ajouter les autres en optimisant l'espace
  for (let i = 1; i < sortedParcels.length; i++) {
    const parcel = sortedParcels[i];
    
    // Essayer d'ajouter en hauteur
    if (result.length >= parcel.length && result.width >= parcel.width) {
      result.height += parcel.height;
      console.log(`  → Ajout en hauteur: +${parcel.height}cm`);
    } 
    // Essayer d'ajouter en largeur
    else if (result.length >= parcel.length && result.height >= parcel.height) {
      result.width += parcel.width;
      console.log(`  → Ajout en largeur: +${parcel.width}cm`);
    }
    // Essayer d'ajouter en longueur
    else if (result.width >= parcel.width && result.height >= parcel.height) {
      result.length += parcel.length;
      console.log(`  → Ajout en longueur: +${parcel.length}cm`);
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
        console.log(`  → Ajustement longueur: ${result.length}cm, hauteur: +${parcel.height}cm`);
      } else if (minDiff === widthDiff) {
        result.width = parcel.width;
        result.height += parcel.height;
        console.log(`  → Ajustement largeur: ${result.width}cm, hauteur: +${parcel.height}cm`);
      } else {
        result.height += parcel.height;
        result.length = Math.max(result.length, parcel.length);
        result.width = Math.max(result.width, parcel.width);
        console.log(`  → Ajustement multiple: L=${result.length}, W=${result.width}, H=${result.height}`);
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

    if (!shippingResponse.ok) {
      throw new Error(`HTTP ${shippingResponse.status}: ${shippingResponse.statusText}`);
    }

    const shippingData = await shippingResponse.json();
    
    return {
      productId,
      dimensions: shippingData.data?.[0] || merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  } catch (error) {
    console.error(`❌ Failed to fetch product ${productId} info:`, error);
    
    return {
      productId,
      dimensions: merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  }
}