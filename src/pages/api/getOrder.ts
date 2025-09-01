// getOrder.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OrderInfo } from '../../types/order';
import * as orderModel from '../../lib/models/orderModel';
import * as chippo from '../../lib/chippo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { trackingNumber, orderId } = req.body as { trackingNumber?: string; orderId?: string };

    if (!trackingNumber && !orderId) return res.status(422).json({ error: 'trackingNumber or orderId is required' });

    // 1️⃣ Cherche d’abord dans MongoDB
    let order: OrderInfo | null = null;
    if (trackingNumber) order = await orderModel.findOrderByTracking(trackingNumber);
    if (!order && orderId) order = await orderModel.findOrderById(orderId);

    // 2️⃣ Si pas trouvé en local, fetch depuis Chippo et stocke
    if (!order) {
      const data = await chippo.getOrders(trackingNumber, orderId);
      order = {
        orderId: data.order_id,
        trackingNumber: data.tracking_number,
        status: data.status,
        carrier: data.provider,
        estimatedDelivery: data.estimated_delivery,
        events: data.events?.map((e: any) => ({ date: e.date, description: e.description })) || [],
      };
      await orderModel.createOrder(order);
    }

    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error getOrders:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
