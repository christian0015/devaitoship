// src/lib/models/shipmentModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShipment extends Document {
  // Références essentielles
  shopUrl: string;
  orderId: string;
  orderNumber?: string;

  // Informations client (pour le dashboard)
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };

  // Adresse de livraison seulement
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

  // Produits/colis simplifié
  items: Array<{
    name: string;
    quantity: number;
    weight?: number;
  }>;

  // IDs Shippo essentiels
  shippoRateId: string;
  shippoTransactionId: string;

  // Informations de tracking
  carrier: string;
  service: string;
  trackingNumber: string;
  trackingUrl: string;
  labelUrl: string;

  // Coût
  shippingCost: number;
  currency: string;

  // Statut simplifié
  status: 'created' | 'purchased' | 'transit' | 'delivered' | 'error';
  
  // NOUVEAU: Source de la clé API utilisée
  apiKeySource: 'client' | 'default';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    shopUrl: { type: String, required: true, index: true },
    orderId: { type: String, required: true },
    orderNumber: { type: String },
    
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String }
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
    
    items: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      weight: { type: Number }
    }],
    
    // IDs Shippo
    shippoRateId: { type: String, required: true },
    shippoTransactionId: { type: String, required: true },
    
    // Tracking
    carrier: { type: String, required: true },
    service: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    trackingUrl: { type: String, required: true },
    labelUrl: { type: String, required: true },
    
    // Coût
    shippingCost: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    
    // Statut
    status: { 
      type: String, 
      enum: ['created', 'purchased', 'transit', 'delivered', 'error'],
      default: 'created'
    },
    
    // NOUVEAU: Source de la clé API utilisée
    apiKeySource: {
      type: String,
      enum: ['client', 'default'],
      default: 'default',
      required: true
    }
  },
  { 
    collection: 'shipments',
    timestamps: true 
  }
);

// Index optimisés
shipmentSchema.index({ shopUrl: 1, orderId: 1 }, { unique: true });
shipmentSchema.index({ shopUrl: 1, createdAt: -1 });
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ apiKeySource: 1 }); // Nouvel index

export const ShipmentModel = mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', shipmentSchema);