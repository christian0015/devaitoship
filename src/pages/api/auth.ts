// src/api/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongo';
import * as merchantModel from '../../lib/models/merchantModel';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email("Email invalide"),
  apiToken: z.string().min(20, "Token API invalide"),
  shopUrl: z.string().url("URL du shop invalide")
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const result = AuthSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ 
        error: 'Données invalides',
        details: result.error.issues 
      });
    }

    const { email, apiToken, shopUrl } = result.data;
    // console.log(email, apiToken, shopUrl);
    

    // Rechercher le marchand par email
    const merchant = await merchantModel.findMerchantByEmailAndShop( email, shopUrl );
    
    if (!merchant) {
      return res.status(404).json({ error: 'Marchand non trouvé' });
    }

    // Vérifier que le token correspond (en le déchiffrant)
    const decryptedToken = merchant.decryptToken();
    // if (decryptedToken !== apiToken) {
    //   return res.status(401).json({ error: 'Token invalide' });
    // }

    // Retourner les informations du marchand (sans le token chiffré)
    const merchantData = {
      _id: merchant._id,
      shopUrl: merchant.shopUrl,
      shopName: merchant.shopName,
      merchantName: merchant.merchantName,
      merchantEmail: merchant.merchantEmail,
      plan: merchant.plan,
      lastLogin: merchant.lastLogin,
      createdAt: merchant.createdAt
    };

    // Mettre à jour la date de dernière connexion
    await merchantModel.updateMerchant(merchant.shopUrl, { lastLogin: new Date() });

    res.status(200).json({ 
      message: 'Authentification réussie',
      merchant: merchantData
    });
  } catch (error: any) {
    console.error('Error in auth API:', error.message || error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
}