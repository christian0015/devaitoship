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


// 
export async function createLabel(rateId: string, pickupPointId?: string) {
  try {
    const payload: any = { rate: rateId };
    if (pickupPointId) payload.pickup = pickupPointId;

    const res = await client.post('labels', payload);

    return {
      tracking_number: res.data?.tracking_number,
      provider: res.data?.provider,
      label_url: res.data?.label_url,
    };
  } catch (err: any) {
    console.error('Erreur createLabel Shippo:', err.response?.data || err.message);
    throw err;
  }
}

export async function getOrders(trackingNumber?: string, orderId?: string) {
  try {
    let res;
    if (trackingNumber) {
      res = await client.get(`transactions/${trackingNumber}`);
    } else if (orderId) {
      res = await client.get(`transactions?order_id=${orderId}`);
    } else {
      throw new Error('trackingNumber or orderId is required');
    }

    const data = res.data;
    return {
      order_id: data?.order_id,
      tracking_number: data?.tracking_number,
      status: data?.status,
      provider: data?.provider,
      estimated_delivery: data?.estimated_delivery,
      events: data?.events?.map((e: any) => ({
        date: e.date,
        description: e.description,
      })) || [],
    };
  } catch (err: any) {
    console.error('Erreur getOrders Shippo:', err.response?.data || err.message);
    throw err;
  }
}

export async function validateRate(rateId: string, from: any, to: any, parcels: any[]) {
  try {
    // On récupère toutes les options de frais pour la création de l'envoi
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
    };

    const res = await client.post('shipments', payload);

    const rate = res.data?.rates?.find((r: any) => r.object_id === rateId);
    if (!rate) throw new Error('Rate not found');

    return {
      rate_id: rate.object_id,
      valid: true,
      amount: rate.amount,
      currency: rate.currency,
      service: rate.servicelevel?.name,
      estimated_days: rate.estimated_days,
    };
  } catch (err: any) {
    console.error('Erreur validateRate Shippo:', err.response?.data || err.message);
    throw err;
  }
}