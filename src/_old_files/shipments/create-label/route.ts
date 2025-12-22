// app/api/shipments/create-label/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ShipmentModel } from '@/lib/models/shipmentModel';

export async function POST(request: NextRequest) {
  try {
    const { rateId, shopUrl, orderData } = await request.json();

    // Validation
    if (!rateId || !shopUrl || !orderData) {
      return NextResponse.json(
        { error: 'rateId, shopUrl et orderData sont requis' },
        { status: 400 }
      );
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
        label_file_type: "PDF",
        async: false
      })
    });

    const transaction = await shippoResponse.json();

    if (transaction.status !== 'SUCCESS') {
      console.error('Erreur Shippo:', transaction.messages);
      return NextResponse.json(
        { 
          error: 'Erreur création du label',
          details: transaction.messages 
        },
        { status: 400 }
      );
    }

    // 2. Vérifier si un shipment existe déjà
    const existingShipment = await ShipmentModel.findOne({
      shopUrl,
      orderId: orderData.orderId
    });

    if (existingShipment) {
      return NextResponse.json(
        { error: 'Un shipment existe déjà pour cette commande' },
        { status: 409 }
      );
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

    return NextResponse.json({
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

  } catch (error) {
    console.error('Erreur création shipment:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}