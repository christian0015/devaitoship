import axios from 'axios';

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY!;
const client = axios.create({
  baseURL: 'https://api.goshippo.com/',
  headers: {
    Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

function formatAddress(address: any) {
  return {
    name: address?.name || '',
    street1: address?.street1 || address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    zip: address?.zip || address?.postal_code || '',
    country: address?.country || '',
    phone: address?.phone || '',
    email: address?.email || '',
  };
}

export async function getRates(from: any, to: any, parcels: any[], options: any = {}) {
  console.log('=== getRates CALLED ===');
  console.log('From:', from);
  console.log('To:', to);
  console.log('Parcels:', parcels);

  const payload = {
    address_from: formatAddress(from),
    address_to: formatAddress(to),
    parcels: parcels.map((p) => ({
      length: parseFloat(p.length),
      width: parseFloat(p.width),
      height: parseFloat(p.height),
      distance_unit: p.distance_unit || 'cm',
      weight: parseFloat(p.weight),
      mass_unit: p.mass_unit || 'kg',
    })),
    async: false,
    ...options,
  };

  console.log('Payload envoyé à Shippo:', JSON.stringify(payload, null, 2));

  try {
    const res = await client.post('shipments', payload);
    console.log('Réponse brute Shippo:', JSON.stringify(res.data, null, 2));

    const rates = res.data?.rates || [];
    return rates.map((rate: any) => ({
      id: rate.object_id,
      carrier: rate.provider,
      service: rate.servicelevel?.name,
      price: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days,
    }));
  } catch (err: any) {
    console.error('Erreur API Shippo complète:', err.response?.data || err.message);
    throw err;
  }
}
