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

    // Construction de la customs_declaration
    const customs_declaration = {
      contents_type: "OTHER" as const, // <-- Shippo n'accepte pas "merchandise"
      certify: true,
      certify_signer: from.name, // ou ton nom, ex: "Test Shop"
      contents_explanation: "Produits e-commerce",
      items: parcels.map(parcel => ({
        description: parcel.description || "Produit",
        quantity: parcel.quantity || 1,
        net_weight: parcel.weight,
        mass_unit: parcel.mass_unit,
        value_amount: parcel.value_amount && parcel.value_amount > 0 ? parcel.value_amount : 1, // <-- éviter 0
        value_currency: parcel.value_currency || "EUR",
        origin_country: parcel.origin_country || from.country || "FR"
      }))
    };


    console.log('=== CUSTOMS DECLARATION ===', customs_declaration);
    console.log('=== CALLING getRates ===');

    const rates = await getRates(from, to, parcels, customs_declaration);
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