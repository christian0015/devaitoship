// pages/api/create-label_combined.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { ShipmentModel } from '@/lib/models/shipmentModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Gérer le preflight OPTIONS ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { rateId, relay_token = null, shopUrl, orderData } = req.body;

    // Validation
    if (!rateId || !shopUrl || !orderData) {
      return res.status(400).json({
        error: 'rateId, shopUrl et orderData sont requis'
      });
    }

    console.log("Création label combiné pour:", {
      rateId,
      relay_token,
      shopUrl,
      orderId: orderData.orderId,
      itemsCount: orderData.items?.length || 0
    });

    // Connexion DB
    try {
      await dbConnect();
    } catch (e: any) {
      console.error("❌ Erreur connexion DB:", e?.message || e);
      throw new Error("Impossible de se connecter à MongoDB.");
    }

    // 1. Créer le label avec Shippo (colis combiné)
    const shippoResponse = await fetch('https://api.goshippo.com/transactions/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
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
    console.log("Transaction Shippo combinée:", {
      status: transaction.status,
      object_id: transaction.object_id,
      tracking: transaction.tracking_number,
      carrier: transaction.rate_carrier
    });

    if (transaction.status !== 'SUCCESS') {
      console.error('Erreur Shippo:', transaction.messages);
      return res.status(400).json({
        error: 'Erreur création du label combiné',
        details: transaction.messages
      });
    }

    // 2. Vérifier si un shipment existe déjà
    const existingShipment = await ShipmentModel.findOne({
      shopUrl,
      orderId: orderData.orderId
    });

    if (existingShipment) {
      return res.status(409).json({
        error: 'Un shipment existe déjà pour cette commande'
      });
    }

    // 3. Calculer le coût total des produits
    const totalProductPrice = orderData.items?.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0) || 0;

    // 4. Sauvegarder dans MongoDB (avec tous les produits combinés)
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
      combinedDimensions: orderData.combinedDimensions || null,
      createdAt: new Date()
    };

    const shipment = await ShipmentModel.create(shipmentData);

    console.log("✅ Shipment combiné créé:", {
      id: shipment._id,
      orderId: shipment.orderId,
      productCount: shipment.productCount,
      tracking: shipment.trackingNumber
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
        totalProductPrice: shipment.totalProductPrice,
        status: shipment.status,
        isCombined: true
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur création shipment combiné:', error);
    return res.status(500).json({
      error: 'Erreur interne du serveur',
      details: error.message
    });
  }
}