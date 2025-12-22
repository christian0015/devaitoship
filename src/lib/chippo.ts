import axios from 'axios';

// Fonction pour créer un client axios avec une clé API spécifique
function createShippoClient(apiKey: string) {
  return axios.create({
    baseURL: 'https://api.goshippo.com/',
    headers: {
      Authorization: `ShippoToken ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}

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

// NOUVELLE fonction pour obtenir la clé API à utiliser
export function getApiKeyToUse(clientApiKey?: string): {
  apiKey: string;
  source: 'client' | 'default';
  isValidClientKey: boolean;
} {
  // Clé API par défaut (la nôtre)
  const defaultApiKey = process.env.SHIPPO_API_KEY!;
  
  // Vérifier si le client a fourni une clé valide
  if (clientApiKey && clientApiKey.trim().length > 5) {
    return {
      apiKey: clientApiKey.trim(),
      source: 'client',
      isValidClientKey: true
    };
  }
  
  // Utiliser notre clé par défaut
  return {
    apiKey: defaultApiKey,
    source: 'default',
    isValidClientKey: false
  };
}

// --- NOUVELLE fonction pour créer une CustomsDeclaration ---
async function createCustomsDeclaration(customs: any, apiKeyInfo: ReturnType<typeof getApiKeyToUse>) {
  console.log('=== createCustomsDeclaration CALLED ===');
  console.log('API Key Source:', apiKeyInfo.source);
  console.log('Payload customs envoyé à Shippo:', JSON.stringify(customs, null, 2));

  try {
    const client = createShippoClient(apiKeyInfo.apiKey);
    const res = await client.post('customs/declarations', customs);
    console.log('Réponse Customs Shippo:', JSON.stringify(res.data, null, 2));
    return res.data?.object_id;
  } catch (err: any) {
    console.error('Erreur API Customs Shippo:', err.response?.data || err.message);
    throw err;
  }
}

export async function getRates(
  from: any, 
  to: any, 
  parcels: any[], 
  customs_declaration?: any,
  clientApiKey?: string,
  // Note: Le clientId n'est plus utilisé pour le comptage en mémoire
) {
  console.log('=== getRates CALLED ===');
  console.log('From:', from);
  console.log('To:', to);
  console.log('Parcels:', parcels);

  // Déterminer quelle clé API utiliser
  const apiKeyInfo = getApiKeyToUse(clientApiKey);
  console.log(`API Key Source: ${apiKeyInfo.source} (Client key valid: ${apiKeyInfo.isValidClientKey})`);

  let customsId: string | undefined;

  // --- Création customs si fourni ---
  if (customs_declaration) {
    try {
      customsId = await createCustomsDeclaration(customs_declaration, apiKeyInfo);
    } catch (err) {
      console.error('=== ERROR creating customs_declaration ===');
      throw err;
    }
  }

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
    ...(customsId ? { customs_declaration: customsId } : {}), // ajout customs si existe
  };

  console.log('Payload envoyé à Shippo:', JSON.stringify(payload, null, 2));

  try {
    const client = createShippoClient(apiKeyInfo.apiKey);
    const res = await client.post('shipments', payload);
    console.log('Réponse brute Shippo:', JSON.stringify(res.data, null, 2));

    const rates = res.data?.rates || [];
    return rates.map((rate: any) => ({
      id: rate.object_id,
      carrier: rate.provider,
      service: rate.servicelevel?.name,
      relayToken: rate.servicelevel?.token,
      img: rate.provider_image_200,
      price: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days,
      apiKeySource: apiKeyInfo.source, // Ajout de la source de la clé
    }));
  } catch (err: any) {
    console.error('Erreur API Shippo complète:', err.response?.data || err.message);
    
    // Messages d'erreur clairs selon la source
    if (apiKeyInfo.source === 'client' && err.response?.status === 401) {
      throw new Error(`CLIENT_API_KEY_INVALID: La clé API Shippo du client est invalide ou expirée. Code d'erreur: ${err.response?.data?.error || 'Non spécifié'}`);
    }
    
    throw new Error(`SHIPPO_API_ERROR: ${err.response?.data?.error || err.message}`);
  }
}

export async function createLabel(
  rateId: string, 
  pickupPointId?: string, 
  clientApiKey?: string
) {
  try {
    // Déterminer quelle clé API utiliser
    const apiKeyInfo = getApiKeyToUse(clientApiKey);
    console.log(`Creating label with API Key Source: ${apiKeyInfo.source}`);
    
    const client = createShippoClient(apiKeyInfo.apiKey);
    const payload: any = { rate: rateId };
    if (pickupPointId) payload.pickup = pickupPointId;

    const res = await client.post('labels', payload);

    return {
      tracking_number: res.data?.tracking_number,
      provider: res.data?.provider,
      label_url: res.data?.label_url,
      apiKeySource: apiKeyInfo.source, // Ajout de la source de la clé
    };
  } catch (err: any) {
    console.error('Erreur createLabel Shippo:', err.response?.data || err.message);
    
    // Messages d'erreur clairs selon la source
    if (err.response?.status === 401) {
      throw new Error(`API_KEY_INVALID: La clé API Shippo utilisée est invalide ou expirée`);
    }
    
    throw new Error(`LABEL_CREATION_FAILED: ${err.response?.data?.error || err.message}`);
  }
}

export async function getOrders(
  trackingNumber?: string, 
  orderId?: string, 
  clientApiKey?: string
) {
  try {
    // Déterminer quelle clé API utiliser
    const apiKeyInfo = getApiKeyToUse(clientApiKey);
    const client = createShippoClient(apiKeyInfo.apiKey);
    
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

export async function validateRate(
  rateId: string, 
  from: any, 
  to: any, 
  parcels: any[], 
  clientApiKey?: string
) {
  try {
    // Déterminer quelle clé API utiliser
    const apiKeyInfo = getApiKeyToUse(clientApiKey);
    const client = createShippoClient(apiKeyInfo.apiKey);
    
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