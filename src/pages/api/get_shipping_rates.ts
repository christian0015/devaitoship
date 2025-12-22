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
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const { shopId, products, toAddress } = req.body;

  // VALIDATION AMÉLIORÉE
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

  console.log(`🚀 Début traitement ${products.length} produits pour shopId: ${shopId}`);

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
    
    // Incrémenter le compteur d'estimations
    let estimationCount = 0;
    try {
      if (merchant.incrementEstimationCount) {
        estimationCount = await merchant.incrementEstimationCount();
        console.log(`📊 Estimation count for client ${shopId}: ${estimationCount} (last 2 months)`);
      }
    } catch (estimationError) {
      console.warn(`⚠️ Erreur comptage estimations:`, estimationError);
    }

    const results: ShippingRate[] = [];
    const startTime = Date.now();

    // Traiter tous les produits en parallèle pour améliorer les performances
    const productPromises = products.map(async (productReq) => {
      try {
        const quantity = productReq.quantity || 1;
        const productInfo = await fetchProductById(merchant, productReq.productId);
        
        const parcel = {
          length: productInfo.dimensions.length,
          width: productInfo.dimensions.width,
          height: productInfo.dimensions.height * quantity,
          weight: productInfo.dimensions.weight * quantity / 1000,
          distance_unit: productInfo.dimensions.distance_unit || "cm",
          mass_unit: productInfo.dimensions.mass_unit || "kg"
        };

        // Utiliser la clé API du client si disponible
        const rates = await getRates(fromAddress, toAddress, [parcel], undefined, clientApiKey);
        
        return {
          productId: productReq.productId,
          quantity,
          rates: rates
        };
      } catch (error: any) {
        console.error(`❌ Erreur produit ${productReq.productId}:`, error.message);
        
        return {
          productId: productReq.productId,
          quantity: productReq.quantity || 1,
          rates: [],
          error: error.message || 'Unknown error'
        };
      }
    });

    // Attendre toutes les promesses
    const productResults = await Promise.all(productPromises);
    results.push(...productResults);

    const processingTime = Date.now() - startTime;
    console.log(`✅ Traitement terminé en ${processingTime}ms pour ${products.length} produits`);

    // Préparer la réponse avec des informations claires
    const successfulProducts = results.filter(r => !r.error && r.rates.length > 0);
    const failedProducts = results.filter(r => r.error || r.rates.length === 0);
    const hasErrors = failedProducts.length > 0;

    res.status(hasErrors ? 207 : 200).json({
      success: successfulProducts.length > 0,
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
      products: results,
      metadata: {
        totalProducts: results.length,
        successfulProducts: successfulProducts.length,
        failedProducts: failedProducts.length,
        processingTimeMs: processingTime,
        clientEstimationCount: estimationCount,
        rateLimitInfo: {
          plan: merchant.plan,
          monthlyLimit: merchant.plan === 'free' ? 100 : 1000 // Exemple de limites
        }
      },
      warnings: hasErrors ? {
        message: `${failedProducts.length} produit(s) ont échoué`,
        failedProducts: failedProducts.map(p => ({
          productId: p.productId,
          error: p.error
        }))
      } : undefined
    });
  } catch (error: any) {
    console.error('❌ Error fetching shipping rates:', error);
    
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

    if (!shippingResponse.ok) {
      throw new Error(`HTTP ${shippingResponse.status}: ${shippingResponse.statusText}`);
    }

    const shippingData = await shippingResponse.json();
    
    return {
      dimensions: shippingData.data?.[0] || merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  } catch (error) {
    console.error(`❌ Failed to fetch product ${productId} info:`, error);
    
    // Retourner les dimensions par défaut
    return {
      dimensions: merchant.defaultDimensions || {
        length: 20, width: 15, height: 10, weight: 1.5, 
        distance_unit: 'cm', mass_unit: 'kg'
      }
    };
  }
}