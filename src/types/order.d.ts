// src/types/order.d.ts
export interface OrderInfo {
  orderId: string;
  trackingNumber: string;
  status: string;
  carrier?: string;
  estimatedDelivery?: string;
  events?: Array<{
    date: string;
    description: string;
  }>;
}
