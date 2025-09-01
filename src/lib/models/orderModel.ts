// import clientPromise from '../mongo';
// import { OrderInfo } from '../../types/order';

// const COLLECTION = 'orders';

// export async function createOrder(order: OrderInfo) {
//   const db = (await clientPromise).db('devaito-shipping');
//   const result = await db.collection<OrderInfo>(COLLECTION).insertOne(order);
//   return result.insertedId;
// }

// export async function findOrderByTracking(trackingNumber: string) {
//   const db = (await clientPromise).db('devaito-shipping');
//   return db.collection<OrderInfo>(COLLECTION).findOne({ trackingNumber });
// }

// export async function findOrderById(orderId: string) {
//   const db = (await clientPromise).db('devaito-shipping');
//   return db.collection<OrderInfo>(COLLECTION).findOne({ orderId });
// }

// export async function updateOrder(trackingNumber: string, update: Partial<OrderInfo>) {
//   const db = (await clientPromise).db('devaito-shipping');
//   return db.collection<OrderInfo>(COLLECTION).updateOne({ trackingNumber }, { $set: update });
// }

// lib/models/orderModels.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  trackingNumber: string;
  status: string;
  carrier?: string;
  estimatedDelivery?: string;
  labelUrl?: string;
  events?: { date: string; description: string }[];
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true, },
    trackingNumber: { type: String, required: true, unique: true, index: true, },
    status: { type: String, required: true },
    carrier: { type: String },
    estimatedDelivery: { type: String },
    labelUrl: { type: String },
    events: [
      {
        date: { type: String },
        description: { type: String },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'devaitoOrders' }
);

const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

// Méthodes CRUD
export async function findOrderByTracking(trackingNumber: string) {
  return OrderModel.findOne({ trackingNumber }).exec();
}

export async function findOrderById(orderId: string) {
  return OrderModel.findOne({ orderId }).exec();
}

export async function createOrder(order: Partial<IOrder>) {
  const doc = new OrderModel(order);
  return doc.save();
}

export async function updateOrder(trackingNumber: string, update: Partial<IOrder>) {
  return OrderModel.updateOne({ trackingNumber }, { $set: update }).exec();
}

export default OrderModel;

