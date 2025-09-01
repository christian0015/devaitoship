import type { NextApiRequest, NextApiResponse } from 'next';
import * as chippo from '../../lib/chippo';
import * as orderModel from '../../lib/models/orderModel';
import { z } from 'zod';


const CreateLabelSchema = z.object({
  rateId: z.string().min(10),
  pickupPointId: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Validation Zod
    const result = CreateLabelSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: 'Invalid payload',
        details: result.error.issues
      });
    }

    const { rateId, pickupPointId, trackingNumber } = result.data;
    // const { rateId, pickupPointId, trackingNumber } = req.body;

    if (!rateId) return res.status(422).json({ error: 'rateId is required' });

    const data = await chippo.createLabel(rateId, pickupPointId);

    // Mettre à jour le statut de la commande ou ajouter trackingNumber dans MongoDB
    if (trackingNumber) {
      await orderModel.updateOrder(trackingNumber, {
        status: 'LABEL_CREATED',
        trackingNumber: data.tracking_number,
        carrier: data.provider,
        labelUrl: data.label_url,
      });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error createLabel:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
