// pages/api/getOrder.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ShipmentModel } from '@/lib/models/shipmentModel';
import * as shippo from '@/lib/chippo';
import dbConnect from '../../lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { trackingNumber, orderId } = req.body as { trackingNumber?: string; orderId?: string };
  console.log('[getOrder] input:', { trackingNumber, orderId });

  if (!trackingNumber && !orderId) {
    return res.status(422).json({ error: 'trackingNumber or orderId is required' });
  }

  try {
    await dbConnect();

    // Recherche locale
    let shipment = await ShipmentModel.findOne({
      $or: [
        ...(trackingNumber ? [{ trackingNumber }] : []),
        ...(orderId ? [{ orderId }] : []),
      ],
    });
    // console.log('[getOrder] shipment local:', shipment);

    // Si pas trouvé localement, fetch Shippo
    if (!shipment) {
      try {
        const shippoData = await shippo.getOrders(trackingNumber, orderId);
        // console.log('[getOrder] shipment Shippo:', shippoData);

        shipment = await ShipmentModel.create({
          shopUrl: 'unknown', // à remplir si tu as la donnée
          orderId: shippoData.order_id || 'unknown',
          trackingNumber: shippoData.tracking_number || trackingNumber || 'unknown',
          carrier: shippoData.provider,
          service: shippoData.provider,
          trackingUrl: '', // si tu as Shippo URL
          labelUrl: '',
          shippingCost: 0,
          currency: 'USD',
          status: mapShippoStatus(shippoData.status),
          apiKeySource: 'default',
          customer: { name: 'unknown' },
          addressTo: {
            name: 'unknown',
            street1: 'unknown',
            city: 'unknown',
            state: 'unknown',
            zip: '00000',
            country: 'unknown',
          },
          items: [],
        });
      } catch (shippoErr: any) {
        console.error('[getOrder] Shippo error:', shippoErr.response?.data || shippoErr.message);
        return res.status(404).json({ error: 'Shipment not found in Shippo either' });
      }
    } else {
      // Update local avec Shippo si possible
      try {
        const shippoData = await shippo.getOrders(trackingNumber, orderId);
        const update: any = {
          carrier: shippoData.provider,
          estimatedDelivery: shippoData.estimated_delivery,
          events: shippoData.events || [],
          status: mapShippoStatus(shippoData.status),
        };
        await ShipmentModel.updateOne({ _id: shipment._id }, { $set: update });
        shipment = { ...shipment.toObject(), ...update };
      } catch (shippoErr) {
        console.warn('[getOrder] Shippo fetch skipped:', shippoErr.message);
      }
    }

    return res.status(200).json({
  orderId: shipment.orderId,
  trackingNumber: shipment.trackingNumber,
  carrier: shipment.carrier,
  status: shipment.status,
  estimatedDelivery: shipment.estimatedDelivery,
  events: shipment.events || [],
  customer: shipment.customer,
  addressTo: shipment.addressTo,
  items: shipment.items,
});

  } catch (error: any) {
    console.error('[getOrder] error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// Helper
function mapShippoStatus(status?: string) {
  switch (status) {
    case 'DELIVERED': return 'delivered';
    case 'TRANSIT': return 'transit';
    case 'ERROR': return 'error';
    default: return 'created';
  }
}
