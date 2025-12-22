// pages/api/create-label_combined.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { ShipmentModel } from '@/lib/models/shipmentModel';
import { findMerchantByShop } from '../../lib/models/merchantModel';
import { getApiKeyToUse } from '../../lib/chippo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Méthode non autorisée',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const { rateId, relay_token = null, shopUrl, orderData } = req.body;

    // Validation améliorée
    if (!rateId || typeof rateId !== 'string' || rateId.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'rateId invalide ou manquant',
        code: 'INVALID_RATE_ID'
      });
    }

    if (!shopUrl || typeof shopUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'shopUrl invalide ou manquant',
        code: 'INVALID_SHOP_URL'
      });
    }

    if (!orderData || !orderData.orderId) {
      return res.status(400).json({
        success: false,
        error: 'orderData invalide ou orderId manquant',
        code: 'INVALID_ORDER_DATA'
      });
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucun produit dans la commande',
        code: 'NO_PRODUCTS_IN_ORDER'
      });
    }

    console.log("🛒 Création label COMBINÉ pour:", {
      rateId: rateId.substring(0, 20) + '...',
      relay_token: relay_token ? 'oui' : 'non',
      shopUrl,
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      productsCount: orderData.items.length
    });

    // Connexion DB
    try {
      await dbConnect();
      console.log("✅ Connecté à MongoDB");
    } catch (e: any) {
      console.error("❌ Erreur de connexion à la base de données :", e?.message || e);
      return res.status(500).json({
        success: false,
        error: "Impossible d'établir une connexion à la base de données MongoDB",
        code: 'DB_CONNECTION_ERROR'
      });
    }

    // CORRIGÉ: Utiliser findMerchantByShop au lieu de findMerchantById
    const merchant = await findMerchantByShop(shopUrl);
    
    if (!merchant) {
      console.error(`❌ Marchand non trouvé pour shopUrl: ${shopUrl}`);
      return res.status(404).json({
        success: false,
        error: 'Marchand non trouvé',
        code: 'MERCHANT_NOT_FOUND',
        details: `Aucun marchand trouvé avec l'URL: ${shopUrl}`
      });
    }

    console.log(`✅ Marchand trouvé: ${merchant.shopName} (ID: ${merchant._id})`);

    let clientApiKey = null;
    
    if (merchant.getShippoApiKey) {
      clientApiKey = merchant.getShippoApiKey();
      console.log(`🔑 Marchand a clé API: ${clientApiKey ? 'Oui' : 'Non'}`);
    }

    // Déterminer quelle clé API utiliser
    const apiKeyInfo = getApiKeyToUse(clientApiKey);
    console.log(`🔑 Source clé API: ${apiKeyInfo.source} (Clé client valide: ${apiKeyInfo.isValidClientKey})`);

    // 1. Créer le label avec Shippo (colis combiné)
    const shippoResponse = await fetch('https://api.goshippo.com/transactions/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKeyInfo.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate: rateId,
        pickupPointId: relay_token,
        servicelevel: relay_token ? { token: relay_token } : undefined,
        label_file_type: "PDF",
        async: false
      })
    });

    const transaction = await shippoResponse.json();
    console.log("📦 Transaction Shippo combinée:", {
      status: transaction.status,
      object_id: transaction.object_id,
      tracking: transaction.tracking_number,
      carrier: transaction.rate_carrier,
      amount: transaction.rate_amount,
      service: transaction.servicelevel_name
    });

    if (transaction.status !== 'SUCCESS') {
      console.error('❌ Erreur Shippo:', transaction.messages);
      
      let errorCode = 'SHIPPO_API_ERROR';
      if (shippoResponse.status === 401) {
        errorCode = apiKeyInfo.source === 'client' ? 'CLIENT_API_KEY_INVALID' : 'DEFAULT_API_KEY_INVALID';
      }
      
      return res.status(400).json({
        success: false,
        error: 'Erreur création du label combiné',
        code: errorCode,
        details: transaction.messages,
        transaction_status: transaction.status
      });
    }

    // 2. Vérifier si un shipment existe déjà
    const existingShipment = await ShipmentModel.findOne({
      shopUrl,
      orderId: orderData.orderId
    });

    if (existingShipment) {
      console.warn(`⚠️ Shipment existe déjà pour ${shopUrl} - ${orderData.orderId}`);
      return res.status(409).json({
        success: false,
        error: 'Un shipment existe déjà pour cette commande',
        code: 'SHIPMENT_ALREADY_EXISTS',
        existingShipmentId: existingShipment._id
      });
    }

    // 3. Calculer les statistiques des produits
    const totalProductPrice = orderData.items?.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0) || 0;

    const totalQuantity = orderData.items?.reduce((sum: number, item: any) => {
      return sum + (item.quantity || 1);
    }, 0) || 0;

    // 4. Calculer les dimensions combinées pour l'enregistrement
    const combinedDimensions = orderData.combinedDimensions || calculateCombinedDimensions(orderData.items);

    // 5. Sauvegarder dans MongoDB (avec tous les produits combinés)
    const shipmentData = {
      shopUrl,
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone
      },
      addressTo: orderData.shippingAddress,
      items: orderData.items, // Tous les produits combinés
      productCount: orderData.items?.length || 0,
      totalQuantity,
      totalProductPrice,
      shippoRateId: rateId,
      shippoTransactionId: transaction.object_id,
      carrier: transaction.rate_carrier || 'Unknown',
      service: transaction.servicelevel_name || 'Standard',
      trackingNumber: transaction.tracking_number,
      trackingUrl: transaction.tracking_url_provider,
      labelUrl: transaction.label_url,
      shippingCost: parseFloat(transaction.rate_amount) || 0,
      currency: transaction.rate_currency || 'USD',
      status: 'purchased',
      isCombinedShipment: true,
      combinedDimensions: combinedDimensions,
      apiKeySource: apiKeyInfo.source, // Enregistrer la source de la clé
      merchantId: merchant._id, // Stocker aussi l'ID du marchand
      createdAt: new Date()
    };

    const shipment = await ShipmentModel.create(shipmentData);

    console.log(`✅ Shipment COMBINÉ créé avec clé ${apiKeyInfo.source}:`, {
      shipmentId: shipment._id,
      orderId: shipment.orderId,
      productCount: shipment.productCount,
      totalQuantity: shipment.totalQuantity,
      tracking: shipment.trackingNumber,
      apiKeySource: shipment.apiKeySource,
      cost: shipment.shippingCost + ' ' + shipment.currency,
      dimensions: combinedDimensions ? `${combinedDimensions.length}x${combinedDimensions.width}x${combinedDimensions.height}cm` : 'Non disponible'
    });

    return res.status(200).json({
      success: true,
      shipment: {
        id: shipment._id,
        trackingNumber: shipment.trackingNumber,
        trackingUrl: shipment.trackingUrl,
        labelUrl: shipment.labelUrl,
        carrier: shipment.carrier,
        service: shipment.service,
        shippingCost: shipment.shippingCost,
        currency: shipment.currency,
        productCount: shipment.productCount,
        totalQuantity: shipment.totalQuantity,
        totalProductPrice: shipment.totalProductPrice,
        status: shipment.status,
        isCombined: true,
        apiKeySource: shipment.apiKeySource
      },
      metadata: {
        apiKeyUsed: apiKeyInfo.source,
        clientHadKey: !!clientApiKey,
        transactionId: transaction.object_id,
        merchantId: merchant._id,
        shopName: merchant.shopName,
        combinedDimensions: combinedDimensions,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur création shipment combiné:', error);
    
    // Déterminer le code d'erreur spécifique
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let statusCode = 500;
    
    if (error.name === 'CastError') {
      errorCode = 'INVALID_ID_FORMAT';
      statusCode = 400;
    } else if (error.code === 11000) {
      errorCode = 'DUPLICATE_SHIPMENT';
      statusCode = 409;
    } else if (error.message?.includes('API_KEY_INVALID')) {
      errorCode = 'API_KEY_INVALID';
      statusCode = 401;
    }
    
    return res.status(statusCode).json({
      success: false,
      error: 'Erreur création du label combiné',
      code: errorCode,
      details: error.message,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Vérifiez que le rateId est toujours valide',
        'Assurez-vous que la clé API Shippo est active',
        'Contactez le support si le problème persiste'
      ]
    });
  }
}

/**
 * Calcule les dimensions combinées à partir des items
 * Fonction utilitaire pour l'enregistrement des dimensions
 */
function calculateCombinedDimensions(items: any[]): {
  length: number;
  width: number;
  height: number;
  weight: number;
  distance_unit: string;
  mass_unit: string;
} | null {
  if (!items || items.length === 0) {
    return null;
  }

  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  items.forEach(item => {
    const dimensions = item.dimensions || {
      length: 20,
      width: 15,
      height: 10,
      weight: 1.5,
      distance_unit: 'cm',
      mass_unit: 'kg'
    };

    const quantity = item.quantity || 1;
    
    maxLength = Math.max(maxLength, dimensions.length);
    maxWidth = Math.max(maxWidth, dimensions.width);
    totalHeight += dimensions.height * quantity;
    totalWeight += (dimensions.weight || 0) * quantity;
  });

  return {
    length: maxLength,
    width: maxWidth,
    height: totalHeight,
    weight: totalWeight,
    distance_unit: 'cm',
    mass_unit: 'kg'
  };
}