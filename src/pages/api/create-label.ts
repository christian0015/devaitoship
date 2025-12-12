// pages/api/create-label.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import { ShipmentModel } from '@/lib/models/shipmentModel';
import { log } from 'console';

import fs from 'fs';
import path from 'path';

/**
 * Handler API pour créer un label d'expédition via Shippo
 * Utilise le Page Router de Next.js (pages/api)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // pour test, autorise tout
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
    const { rateId, relay_token=null, shopUrl, orderData } = req.body;

    // Validation
    if (!rateId || !shopUrl || !orderData) {
      return res.status(400).json({
        error: 'rateId, shopUrl et orderData sont requis'
      });
    }
    console.log("Element recu: ", rateId, relay_token, shopUrl, orderData);

    try {
      await dbConnect();
    } catch (e: any) {
      console.error("❌ Erreur de connexion à la base de données :", e?.message || e);
      throw new Error("Impossible d’établir une connexion à la base de données MongoDB.");
    }    

    // 1. Créer le label avec Shippo
    const shippoResponse = await fetch('https://api.goshippo.com/transactions/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate: rateId,
        pickupPointId: relay_token,
        servicelevel: {
            token: relay_token
        },
        label_file_type: "PDF",
        async: false
      })
    });

    const transaction = await shippoResponse.json();
    console.log("Transaction: ", transaction);
    

    
    // Définir le chemin du fichier où tu veux sauvegarder
    const filePath = path.join(process.cwd(), 'transaction_log.json');

    // Convertir l'objet en JSON avec indentation pour lecture facile
    const jsonData = JSON.stringify(transaction, null, 2);

    // Écrire dans le fichier
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error('Erreur lors de l’écriture du fichier :', err);
      } else {
        console.log('Transaction enregistrée dans transaction_log.json');
      }
    });



    if (transaction.status !== 'SUCCESS') {
      console.error('Erreur Shippo:', transaction.messages);
      return res.status(400).json({
        error: 'Erreur création du label',
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

    // 3. Sauvegarder dans MongoDB
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
      items: orderData.items,
      shippoRateId: rateId,
      shippoTransactionId: transaction.object_id,
      carrier: transaction.rate_carrier || 'Unknown',
      service: transaction.servicelevel_name || 'Standard',
      trackingNumber: transaction.tracking_number,
      trackingUrl: transaction.tracking_url_provider,
      labelUrl: transaction.label_url,
      shippingCost: parseFloat(transaction.rate_amount) || 0,
      currency: transaction.rate_currency || 'USD',
      status: 'purchased'
    };

    const shipment = await ShipmentModel.create(shipmentData);

    return res.status(200).json({
      success: true,
      shipment: {
        id: shipment._id,
        trackingNumber: shipment.trackingNumber,
        trackingUrl: shipment.trackingUrl,
        labelUrl: shipment.labelUrl,
        carrier: shipment.carrier,
        status: shipment.status
      }
    });

  } catch (error: any) {
    console.error('Erreur création shipment:', error);
    return res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
}
