import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongo';
import * as merchantModel from '../../../lib/models/merchantModel';
import { z } from 'zod';

const UpdateMerchantSchema = z.object({
  shopName: z.string().min(1, "Le nom de la boutique est requis").optional(),
  shopUrl: z.string().url("URL de boutique invalide").optional(),
  merchantName: z.string().optional(),
  merchantEmail: z.string().email("Email invalide").optional(),
  apiKey: z.string().optional(),
  shippingAddress: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal(''))
  }).optional(),
  defaultDimensions: z.object({
    length: z.number().nonnegative("La longueur doit être positive ou nulle").optional(), // CORRECTION ICI
    width: z.number().nonnegative("La largeur doit être positive ou nulle").optional(), // CORRECTION ICI
    height: z.number().nonnegative("La hauteur doit être positive ou nulle").optional(), // CORRECTION ICI
    weight: z.number().nonnegative("Le poids doit être positif ou nul").optional(), // CORRECTION ICI
    distance_unit: z.enum(['cm', 'in']).optional(),
    mass_unit: z.enum(['kg', 'lb']).optional()
  }).optional(),
  webhookUrl: z.string().url("URL de webhook invalide").optional(),
  plan: z.enum(['free', 'pro']).optional()
}).strict();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Seulement PUT et DELETE sont autorisés
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  try {
    await dbConnect();
    
    const { id } = req.query;
    console.log('id: ', id)
    
    // Vérifier que l'ID est fourni et n'est pas un tableau
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'ID du marchand requis' });
    }

    if (req.method === 'PUT') {
      // Validation des données
      const result = UpdateMerchantSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(422).json({
          error: 'Données invalides',
          details: result.error.issues
        });
      }


      // Empêcher la modification des champs sensibles
      const updateData = { ...result.data };
      delete (updateData as any).apiToken;
      delete (updateData as any).createdAt;

      // Vérifier que le marchand existe
      const existingMerchant = await merchantModel.findMerchantById(id);
      if (!existingMerchant) {
        return res.status(404).json({ error: 'Marchand non trouvé' });
      }

      // Vérifier l'unicité du shopUrl si modifié
      if (updateData.shopUrl && updateData.shopUrl !== existingMerchant.shopUrl) {
        const existingUrl = await merchantModel.findMerchantByShop(updateData.shopUrl);
        if (existingUrl && existingUrl._id.toString() !== id) {
          return res.status(409).json({ 
            error: 'Cette URL de boutique est déjà utilisée' 
          });
        }
      }



      // // Fonction utilitaire pour nettoyer les objets - version améliorée
      // function cleanUpdateObject(obj: any, existingData: any): any {
      //   if (obj === null || obj === undefined) return {};
        
      //   const cleaned: any = {};
        
      //   Object.entries(obj).forEach(([key, value]) => {
      //     // Ne pas inclure les valeurs undefined, null
      //     if (value !== undefined && value !== null) {
      //       // Pour les chaînes vides, vérifier si la clé existe déjà dans les données existantes
      //       if (typeof value === 'string' && value.trim() === '') {
      //         // Ne pas inclure les chaînes vides pour les nouvelles clés
      //         if (existingData && existingData[key] !== undefined) {
      //           cleaned[key] = value; // Inclure si la clé existe déjà
      //         }
      //       } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      //         // Nettoyer récursivement les objets imbriqués
      //         const existingNested = existingData && existingData[key] || {};
      //         const cleanedNested = cleanUpdateObject(value, existingNested);
      //         if (Object.keys(cleanedNested).length > 0) {
      //           cleaned[key] = cleanedNested;
      //         }
      //       } else {
      //         cleaned[key] = value;
      //       }
      //     }
      //   });
        
      //   return cleaned;
      // }

      // // Fonction utilitaire pour nettoyer les objets - version améliorée
      // function cleanUpdateObject(obj: any, existingData: any): any {
      //   if (obj === null || obj === undefined) return {};
        
      //   const cleaned: any = {};
        
      //   Object.entries(obj).forEach(([key, value]) => {
      //     // Ne pas inclure les valeurs undefined, null
      //     if (value !== undefined && value !== null) {
      //       // Pour les chaînes vides, vérifier si la clé existe déjà dans les données existantes
      //       if (typeof value === 'string' && value.trim() === '') {
      //         // Ne pas inclure les chaînes vides pour les nouvelles clés
      //         if (existingData && existingData[key] !== undefined) {
      //           cleaned[key] = value; // Inclure si la clé existe déjà
      //         }
      //       } 
      //       // Pour les nombres égaux à 0, même logique: seulement si la clé existe déjà
      //       else if (typeof value === 'number' && value === 0) {
      //         // Ne pas inclure les nombres 0 pour les nouvelles clés
      //         if (existingData && existingData[key] !== undefined) {
      //           cleaned[key] = value; // Inclure si la clé existe déjà
      //         }
      //       }
      //       else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      //         // Nettoyer récursivement les objets imbriqués
      //         const existingNested = existingData && existingData[key] || {};
      //         const cleanedNested = cleanUpdateObject(value, existingNested);
      //         if (Object.keys(cleanedNested).length > 0) {
      //           cleaned[key] = cleanedNested;
      //         }
      //       } else {
      //         cleaned[key] = value;
      //       }
      //     }
      //   });
        
      //   return cleaned;
      // }


      // Fonction utilitaire pour nettoyer les objets - version améliorée
      function cleanUpdateObject(obj: any, existingData: any): any {
        if (obj === null || obj === undefined) return {};
        
        const cleaned: any = {};
        
        Object.entries(obj).forEach(([key, value]) => {
          // Ne pas inclure les valeurs undefined, null
          if (value !== undefined && value !== null) {
            // Pour les chaînes vides, vérifier si la clé existe déjà dans les données existantes
            if (typeof value === 'string' && value.trim() === '') {
              // Ne pas inclure les chaînes vides pour les nouvelles clés
              if (existingData && existingData[key] !== undefined) {
                cleaned[key] = value; // Inclure si la clé existe déjà
              }
            } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
              // Nettoyer récursivement les objets imbriqués
              const existingNested = existingData && existingData[key] || {};
              const cleanedNested = cleanUpdateObject(value, existingNested);
              
              // RÈGLE SPÉCIALE pour defaultDimensions
              if (key === 'defaultDimensions') {
                // Si toutes les dimensions numériques sont 0, ne pas inclure l'objet
                const { length = 0, width = 0, height = 0, weight = 0 } = cleanedNested;
                const allDimensionsZero = length === 0 && width === 0 && height === 0 && weight === 0;
                
                // Si toutes les dimensions sont 0, on vérifie si l'objet existait déjà
                if (allDimensionsZero) {
                  // Vérifier si l'objet defaultDimensions existait déjà avec des valeurs non-nulles
                  const existingDimensions = existingData && existingData.defaultDimensions;
                  const existingHasNonZero = existingDimensions && 
                    (existingDimensions.length > 0 || 
                    existingDimensions.width > 0 || 
                    existingDimensions.height > 0 || 
                    existingDimensions.weight > 0);
                  
                  // Ne pas inclure si soit:
                  // 1. L'objet n'existait pas avant
                  // 2. L'objet existait mais toutes ses dimensions étaient déjà 0
                  if (!existingDimensions || 
                      (existingDimensions.length === 0 && 
                      existingDimensions.width === 0 && 
                      existingDimensions.height === 0 && 
                      existingDimensions.weight === 0)) {
                    return; // Ne pas ajouter defaultDimensions à cleaned
                  }
                }
              }
              
              if (Object.keys(cleanedNested).length > 0) {
                cleaned[key] = cleanedNested;
              }
            } else {
              // Pour les nombres 0, même logique: seulement si la clé existe déjà
              if (typeof value === 'number' && value === 0) {
                if (existingData && existingData[key] !== undefined) {
                  cleaned[key] = value;
                }
              } else {
                cleaned[key] = value;
              }
            }
          }
        });
        
        return cleaned;
      }
      // Créer un objet nettoyé pour la mise à jour
      const cleanedUpdateData = cleanUpdateObject(updateData, existingMerchant.toObject());

      // Ajouter lastLogin
      cleanedUpdateData.lastLogin = new Date();

      // Mettre à jour le marchand
      const updatedMerchant = await merchantModel.updateMerchantById(id, cleanedUpdateData);

      // // Mettre à jour le marchand
      // const updatedMerchant = await merchantModel.updateMerchantById(id, {
      //   ...updateData,
      //   lastLogin: new Date()
      // });

      if (!updatedMerchant) {
        return res.status(500).json({ error: 'Échec de la mise à jour' });
      }

      // Retourner les données mises à jour
      const responseData = {
        _id: updatedMerchant._id,
        shopUrl: updatedMerchant.shopUrl,
        shopName: updatedMerchant.shopName,
        merchantName: updatedMerchant.merchantName,
        merchantEmail: updatedMerchant.merchantEmail,
        apiToken: updatedMerchant.apiToken,
        plan: updatedMerchant.plan,
        shippingAddress: updatedMerchant.shippingAddress,
        defaultDimensions: updatedMerchant.defaultDimensions,
        webhookUrl: updatedMerchant.webhookUrl,
        lastLogin: updatedMerchant.lastLogin,
        createdAt: updatedMerchant.createdAt
      };

      return res.status(200).json({
        message: 'Marchand mis à jour avec succès',
        merchant: responseData
      });

    } else if (req.method === 'DELETE') {
      // Vérifier que le marchand existe
      const existingMerchant = await merchantModel.findMerchantById(id);
      if (!existingMerchant) {
        return res.status(404).json({ error: 'Marchand non trouvé' });
      }

      // Supprimer le marchand
      const deleteResult = await merchantModel.deleteMerchantById(id);

      if (!deleteResult) {
        return res.status(500).json({ error: 'Échec de la suppression' });
      }

      return res.status(200).json({
        message: 'Compte marchand supprimé avec succès',
        deleted: true
      });
    }

  } catch (error: any) {
    console.error('Error in merchants API:', error);
    
    // Log détaillé pour déboguer
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({ 
      error: 'Erreur interne du serveur', 
      details: error.message 
    });
  }
}