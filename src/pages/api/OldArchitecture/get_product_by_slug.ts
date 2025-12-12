// src/api/get_product_by_slug/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongo';
import { findMerchantById } from '../../../lib/models/merchantModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const { shopId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Product slug is required' });
  }

  if (!shopId) {
    return res.status(400).json({ error: 'Shop ID is required' });
  }

  try {
    await dbConnect();
    
    const merchant = await findMerchantById(shopId);
    
    if (!merchant) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Utiliser le token décrypté côté serveur pour appeler l'API Devaito
    const decryptedToken = merchant.decryptToken();
    
    // Appel à l'API Devaito pour récupérer le produit
    const response = await fetch(`${merchant.shopUrl}/api/products/${slug}`, {
      headers: { 
        'Authorization': `Bearer ${decryptedToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const productData = await response.json();

    // Formater la réponse pour le frontend
    const product = {
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      quantity: productData.quantity || 1,
      dimensions: productData.dimensions || merchant.defaultDimensions,
      shippingAddress: productData.shippingAddress || merchant.shippingAddress,
      price: productData.price
    };

    res.status(200).json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}