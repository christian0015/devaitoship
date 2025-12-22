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

// Interface pour le comptage d'estimations mensuel
export interface IEstimationCount {
  monthYear: string; // Format "YYYY-MM"
  count: number;
  lastUpdated: Date;
}

export interface IMerchant extends Document {
  shopUrl: string;
  shopName: string;
  merchantName?: string;
  merchantEmail: string;
  apiToken: string;
  plan: 'free' | 'pro';
  lastLogin: Date;
  webhookUrl?: string;

  // NOUVEAUX CHAMPS OPTIONNELS
  shippingAddress?: IShippingAddress;
  defaultDimensions?: IDimensions;
  apiKey: string;

  // NOUVEAU: Compteur d'estimations mensuelles
  estimationCounts: IEstimationCount[];

  createdAt: Date;
  updatedAt: Date;
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

const estimationCountSchema = new Schema<IEstimationCount>({
  monthYear: { type: String, required: true }, // Format "YYYY-MM"
  count: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const merchantSchema = new Schema<IMerchant>(
  {
    shopUrl: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    merchantName: { type: String },
    merchantEmail: { type: String, required: true },
    apiToken: { type: String, required: true, set: encrypt },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    lastLogin: { type: Date, default: Date.now },
    webhookUrl: { type: String },

    // Nouveaux champs optionnels
    shippingAddress: { type: shippingAddressSchema },
    defaultDimensions: { type: dimensionsSchema },
    apiKey: { type: String },

    // NOUVEAU: Compteur d'estimations mensuelles
    estimationCounts: {
      type: [estimationCountSchema],
      default: []
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { 
    collection: 'devaitoMerchants',
    timestamps: true 
  }
);

// MÉTHODE: Récupérer la clé API Shippo du client
merchantSchema.methods.getShippoApiKey = function(): string | null {
  try {
    if (this.apiKey && this.apiKey.trim().length > 5) {
      return this.apiKey.trim();
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération Shippo API Key:', error);
    return null;
  }
};

// MÉTHODE: Incrémenter le compteur d'estimations pour le mois courant
merchantSchema.methods.incrementEstimationCount = async function() {
  try {
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Trouver l'entrée du mois courant
    let monthEntry = this.estimationCounts.find(
      (entry: IEstimationCount) => entry.monthYear === currentMonthYear
    );
    
    if (monthEntry) {
      monthEntry.count += 1;
      monthEntry.lastUpdated = now;
    } else {
      // Ajouter une nouvelle entrée pour ce mois
      this.estimationCounts.push({
        monthYear: currentMonthYear,
        count: 1,
        lastUpdated: now
      });
    }
    
    // Nettoyer les anciennes entrées (garder seulement les 2 derniers mois)
    const [currentYear, currentMonth] = currentMonthYear.split('-').map(Number);
    
    let monthBefore = currentMonth - 1;
    let yearBefore = currentYear;
    
    if (monthBefore === 0) {
      monthBefore = 12;
      yearBefore -= 1;
    }
    
    const previousMonth = `${yearBefore}-${monthBefore.toString().padStart(2, '0')}`;
    const validMonths = [currentMonthYear, previousMonth];
    
    this.estimationCounts = this.estimationCounts.filter((entry: IEstimationCount) =>
      validMonths.includes(entry.monthYear)
    );
    
    this.updatedAt = now;
    await this.save();
    
    return this.getEstimationCount();
  } catch (error) {
    console.error('Erreur incrémentation compteur estimations:', error);
    return 0;
  }
};

// MÉTHODE: Obtenir le nombre total d'estimations des 2 derniers mois
merchantSchema.methods.getEstimationCount = function(): number {
  try {
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const [currentYear, currentMonth] = currentMonthYear.split('-').map(Number);
    
    let monthBefore = currentMonth - 1;
    let yearBefore = currentYear;
    
    if (monthBefore === 0) {
      monthBefore = 12;
      yearBefore -= 1;
    }
    
    const previousMonth = `${yearBefore}-${monthBefore.toString().padStart(2, '0')}`;
    const validMonths = [currentMonthYear, previousMonth];
    
    return this.estimationCounts
      .filter((entry: IEstimationCount) => validMonths.includes(entry.monthYear))
      .reduce((total: number, entry: IEstimationCount) => total + entry.count, 0);
  } catch (error) {
    console.error('Erreur calcul compteur estimations:', error);
    return 0;
  }
};

// MÉTHODE: Obtenir les statistiques d'estimations détaillées
merchantSchema.methods.getEstimationStats = function(): {
  totalLast2Months: number;
  currentMonth: number;
  previousMonth: number;
  months: IEstimationCount[];
} {
  try {
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const [currentYear, currentMonth] = currentMonthYear.split('-').map(Number);
    
    let monthBefore = currentMonth - 1;
    let yearBefore = currentYear;
    
    if (monthBefore === 0) {
      monthBefore = 12;
      yearBefore -= 1;
    }
    
    const previousMonth = `${yearBefore}-${monthBefore.toString().padStart(2, '0')}`;
    const validMonths = [currentMonthYear, previousMonth];
    
    const validEntries = this.estimationCounts.filter((entry: IEstimationCount) =>
      validMonths.includes(entry.monthYear)
    );
    
    const currentMonthEntry = validEntries.find(
      (entry: IEstimationCount) => entry.monthYear === currentMonthYear
    );
    
    const previousMonthEntry = validEntries.find(
      (entry: IEstimationCount) => entry.monthYear === previousMonth
    );
    
    return {
      totalLast2Months: validEntries.reduce((total: number, entry: IEstimationCount) => total + entry.count, 0),
      currentMonth: currentMonthEntry ? currentMonthEntry.count : 0,
      previousMonth: previousMonthEntry ? previousMonthEntry.count : 0,
      months: validEntries
    };
  } catch (error) {
    console.error('Erreur récupération stats estimations:', error);
    return {
      totalLast2Months: 0,
      currentMonth: 0,
      previousMonth: 0,
      months: []
    };
  }
};

merchantSchema.methods.decryptToken = function() {
  const decrypt = require('../crypto').decrypt;
  return decrypt(this.apiToken);
};

const MerchantModel = mongoose.models.Merchant || mongoose.model<IMerchant>('Merchant', merchantSchema);

// Méthodes CRUD
export async function createMerchant(merchant: Partial<IMerchant>) {
  const doc = new MerchantModel(merchant);
  await doc.save();
  return doc;
}

export async function findMerchantById(id: string) {
  return MerchantModel.findById(id).exec();
}

export async function findMerchantByShop(shopUrl: string) {
  return MerchantModel.findOne({ shopUrl }).exec();
}

export async function findMerchantByEmail(email: string) {
  return MerchantModel.findOne({ merchantEmail: email }).exec();
}

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

export async function deleteMerchantById(id: string) {
  return MerchantModel.findByIdAndDelete(id).exec();
}

export default MerchantModel;