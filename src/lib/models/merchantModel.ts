// import clientPromise from '../mongo';
// import { Merchant } from '../../types/merchant';

// const COLLECTION = 'merchants';

// export async function findMerchantByShop(shopUrl: string) {
//   const db = (await clientPromise).db('devaito-shipping');
//   return db.collection<Merchant>(COLLECTION).findOne({ shopUrl });
// }

// export async function createMerchant(merchant: Merchant) {
//   const db = (await clientPromise).db('devaito-shipping');
//   const result = await db.collection<Merchant>(COLLECTION).insertOne(merchant);
//   return result.insertedId;
// }

// export async function updateMerchant(shopUrl: string, update: Partial<Merchant>) {
//   const db = (await clientPromise).db('devaito-shipping');
//   return db.collection<Merchant>(COLLECTION).updateOne({ shopUrl }, { $set: update });
// }

// lib/models/merchantModels.ts
import mongoose, { Schema, Document } from 'mongoose';
import { encrypt } from '../crypto';

// Interface pour l'adresse d'expédition
export interface IShippingAddress {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

// Interface pour les dimensions par défaut
export interface IDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  distance_unit: 'cm' | 'in';
  mass_unit: 'kg' | 'lb';
}

export interface IMerchant extends Document {
  shopUrl: string;
  shopName: string;
  merchantName?: string;
  merchantEmail: string;
  // merchantName?: string;
  apiToken: string;
  plan: 'free' | 'pro';
  lastLogin: Date;
  webhookUrl?: string; // Pour les notifications

  // NOUVEAUX CHAMPS OPTIONNELS
  shippingAddress?: IShippingAddress;
  defaultDimensions?: IDimensions;

  createdAt: Date;
}


const shippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String },
  company: { type: String },
  street1: { type: String, required: true },
  street2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
  email: { type: String }
});

const dimensionsSchema = new Schema<IDimensions>({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  distance_unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
  mass_unit: { type: String, enum: ['kg', 'lb'], default: 'kg' }
});



const merchantSchema = new Schema<IMerchant>(
  {
    shopUrl: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    merchantName: { type: String },
    merchantEmail: { type: String, required: true },
    // merchantName: { type: String },
    // apiToken: { type: String, required: true },
    apiToken: { type: String, required: true, set: encrypt }, // Utilisation du setter de chiffrement
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    lastLogin: { type: Date, default: Date.now },
    webhookUrl: { type: String },

    // Nouveaux champs optionnels
    shippingAddress: { type: shippingAddressSchema },
    defaultDimensions: { type: dimensionsSchema },

    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'devaitoMerchants' }
);

merchantSchema.methods.decryptToken = function() {
  const decrypt = require('../crypto').decrypt;
  return decrypt(this.apiToken);
};

const MerchantModel = mongoose.models.Merchant || mongoose.model<IMerchant>('Merchant', merchantSchema);

// Méthodes CRUD
export async function createMerchant(merchant: Partial<IMerchant>) {
  const doc = new MerchantModel(merchant);
  // return doc.save();
  await doc.save();
  return doc;
}

export async function findMerchantById(id: string) {
  return MerchantModel.findById(id).exec();
}

export async function findMerchantByShop(shopUrl: string) {
  return MerchantModel.findOne({ shopUrl }).exec();
}

// NOUVELLE MÉTHODE - Ajoutez celle-ci
export async function findMerchantByEmail(email: string) {
  return MerchantModel.findOne({ merchantEmail: email }).exec();
}

// NOUVELLE MÉTHODE - Recherche par email ET shopUrl
export async function findMerchantByEmailAndShop(email: string, shopUrl: string) {
  return MerchantModel.findOne({ 
    merchantEmail: email,
    shopUrl: shopUrl 
  }).exec();
}

export async function updateMerchant(shopUrl: string, update: Partial<IMerchant>) {
  return MerchantModel.updateOne({ shopUrl }, { $set: update }).exec();
}

export async function updateMerchantById(id: string, update: Partial<IMerchant>) {
  return MerchantModel.findByIdAndUpdate(id, update, { new: true }).exec();
}

export default MerchantModel;
