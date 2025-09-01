

// pages/api/test-shipping.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configuration pour contourner les problèmes SSL (développement seulement)
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    // Données de test
    const requestData = {
      address_from: {
        name: 'Test Shop',
        street1: '123 Main St',
        city: 'Paris',
        state: 'Île-de-France',
        zip: '75001',
        country: 'FR',
        phone: '+33123456789',
        email: 'shop@example.com'
      },
      address_to: {
        name: 'Test Customer',
        street1: '456 Side St',
        city: 'Lyon',
        state: 'Auvergne-Rhône-Alpes',
        zip: '69002',
        country: 'FR',
        phone: '+33456789123',
        email: 'customer@example.com'
      },
      parcels: [
        {
          length: 20,
          width: 15,
          height: 10,
          distance_unit: 'cm',
          weight: 1.5,
          mass_unit: 'kg'
        }
      ],
      async: false
    };

    const response = await fetch('https://api.chippo.com/shipments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHIPPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      agent // Utilise l'agent configuré
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rates = data.rates || [];

    // Formater la réponse comme dans votre exemple PHP
    const formattedRates = rates.map((rate: any) => ({
      id: rate.object_id,
      carrier: rate.provider,
      service: rate.servicelevel?.name || 'N/A',
      price: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days,
    }));

    res.status(200).json(formattedRates);
  } catch (error: any) {
    console.error('Test shipping error:', error);
    res.status(500).json({ 
      error: 'Failed to get test rates',
      message: error.message,
    });
  }
}