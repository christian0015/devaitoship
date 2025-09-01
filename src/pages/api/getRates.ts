import type { NextApiRequest, NextApiResponse } from 'next';
import { getRates } from '../../lib/chippo';
import { GetRatesSchema } from '../../lib/validation/shippoSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== /shipping/rates called ===');
  console.log('Method:', req.method);
  console.log('Raw body:', req.body);

   // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // pour test, autorise tout
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // réponse rapide pour preflight
  }


  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validation avec Zod
    const parsed = GetRatesSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('=== VALIDATION FAILED ===');
      console.log(JSON.stringify(parsed.error.format(), null, 2));
      return res.status(422).json({
        error: 'Invalid payload',
        details: parsed.error.issues,
      });
    }

    console.log('=== VALIDATION OK ===');
    const { from, to, parcels } = parsed.data;
    console.log('From:', from);
    console.log('To:', to);
    console.log('Parcels:', parcels);

    if (!from || !to || !parcels?.length) {
      console.log('=== MISSING DATA ===');
      return res.status(422).json({ error: 'from, to, and parcels are required' });
    }

    console.log('=== CALLING getRates ===');
    const rates = await getRates(from, to, parcels);
    console.log('=== RATES RECEIVED ===', rates);

    return res.status(200).json(rates);
  } catch (error: any) {
    console.error('=== ERROR IN HANDLER ===');
    console.error(error?.response?.data || error?.message || error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error?.response?.data || error?.message,
    });
  }
}
