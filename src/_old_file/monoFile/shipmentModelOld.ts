// lib/models/shipmentModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShipment extends Document {
  // Référence au merchant
  merchant: Types.ObjectId;
  shopUrl: string;

  // Informations de l'expédition
  orderId: string; // ID de commande du shop
  orderNumber?: string; // Numéro de commande lisible

  // Adresses
  addressFrom: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
  };
  
  addressTo: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
  };

  // Informations du colis
  parcel: {
    length: number;
    width: number;
    height: number;
    distance_unit: string;
    weight: number;
    mass_unit: string;
  };

  // Informations Shippo
  shippoRateId: string;
  shippoShipmentId: string;
  shippoTransactionId: string;
  shippoCustomsId?: string;

  // Informations de tracking
  carrier: string;
  service: string;
  trackingNumber: string;
  trackingUrl: string;
  labelUrl: string;
  commercialInvoiceUrl?: string;

  // Coût et devis
  shippingCost: number;
  currency: string;
  estimatedDays: number;

  // Statut
  status: 'created' | 'purchased' | 'transit' | 'delivered' | 'cancelled' | 'error';
  
  // Métadonnées
  metadata?: any;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    merchant: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
    shopUrl: { type: String, required: true },
    
    orderId: { type: String, required: true },
    orderNumber: { type: String },
    
    addressFrom: {
      name: { type: String, required: true },
      street1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
      email: { type: String }
    },
    
    addressTo: {
      name: { type: String, required: true },
      street1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
      email: { type: String }
    },
    
    parcel: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      distance_unit: { type: String, required: true },
      weight: { type: Number, required: true },
      mass_unit: { type: String, required: true }
    },
    
    // IDs Shippo
    shippoRateId: { type: String, required: true },
    shippoShipmentId: { type: String, required: true },
    shippoTransactionId: { type: String, required: true },
    shippoCustomsId: { type: String },
    
    // Tracking
    carrier: { type: String, required: true },
    service: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    trackingUrl: { type: String, required: true },
    labelUrl: { type: String, required: true },
    commercialInvoiceUrl: { type: String },
    
    // Coût
    shippingCost: { type: Number, required: true },
    currency: { type: String, required: true },
    estimatedDays: { type: Number, required: true },
    
    // Statut
    status: { 
      type: String, 
      enum: ['created', 'purchased', 'transit', 'delivered', 'cancelled', 'error'],
      default: 'created'
    },
    
    metadata: { type: Schema.Types.Mixed },
    
    // Dates
    shippedAt: { type: Date },
    deliveredAt: { type: Date }
  },
  { 
    collection: 'shipments',
    timestamps: true 
  }
);

// Index pour performances
shipmentSchema.index({ merchant: 1, createdAt: -1 });
shipmentSchema.index({ shopUrl: 1 }); // ✅ NOUVEL INDEX sur shopUrl seul
shipmentSchema.index({ shopUrl: 1, orderId: 1 });
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ status: 1 });

const ShipmentModel = mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', shipmentSchema);

// Méthodes CRUD
export async function createShipment(shipmentData: Partial<IShipment>) {
  const doc = new ShipmentModel(shipmentData);
  await doc.save();
  return doc;
}

export async function findShipmentsByMerchant(merchantId: string, limit = 50, skip = 0) {
  return ShipmentModel.find({ merchant: merchantId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
}

export async function findShipmentByOrder(shopUrl: string, orderId: string) {
  return ShipmentModel.findOne({ shopUrl, orderId }).exec();
}

export async function findShipmentByTracking(trackingNumber: string) {
  return ShipmentModel.findOne({ trackingNumber }).exec();
}

export async function updateShipmentStatus(transactionId: string, status: IShipment['status'], updates: Partial<IShipment> = {}) {
  const updateData: any = { status, ...updates };
  
  // Mettre à jour les dates en fonction du statut
  if (status === 'transit' && !updates.shippedAt) {
    updateData.shippedAt = new Date();
  } else if (status === 'delivered' && !updates.deliveredAt) {
    updateData.deliveredAt = new Date();
  }
  
  return ShipmentModel.findOneAndUpdate(
    { shippoTransactionId: transactionId },
    updateData,
    { new: true }
  ).exec();
}

export async function getShipmentStats(merchantId: string) {
  return ShipmentModel.aggregate([
    { $match: { merchant: new mongoose.Types.ObjectId(merchantId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalCost: { $sum: '$shippingCost' }
      }
    }
  ]).exec();
}

// Dans shipmentModel.ts - AJOUTEZ CES MÉTHODES

// Récupérer tous les shipments d'un shop
export async function findShipmentsByShopUrl(shopUrl: string, limit = 50, skip = 0) {
  return ShipmentModel.find({ shopUrl })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
}

// Récupérer les shipments récents d'un shop
export async function findRecentShipmentsByShopUrl(shopUrl: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return ShipmentModel.find({ 
    shopUrl, 
    createdAt: { $gte: startDate } 
  })
    .sort({ createdAt: -1 })
    .exec();
}

// Statistiques par shop
export async function getShipmentStatsByShopUrl(shopUrl: string) {
  return ShipmentModel.aggregate([
    { $match: { shopUrl } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalCost: { $sum: '$shippingCost' }
      }
    }
  ]).exec();
}

// Vérifier si un order a déjà un shipment
export async function hasExistingShipment(shopUrl: string, orderId: string) {
  const count = await ShipmentModel.countDocuments({ shopUrl, orderId });
  return count > 0;
}

export default ShipmentModel;