// validateRates.js
import type { NextApiRequest, NextApiResponse } from 'next';
import * as chippo from '../../lib/chippo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { rateId, from, to, parcels } = req.body;

    if (!rateId || !from || !to || !parcels) {
      return res.status(422).json({ error: 'rateId, from, to and parcels are required' });
    }

    const data = await chippo.validateRate(rateId, from, to, parcels);

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error validateRate:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
