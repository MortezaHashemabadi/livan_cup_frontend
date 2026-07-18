import { api } from "../client";
import type { Variant } from "./catalog";

export interface OrderItem {
  id: number;
  variant: number;
  variant_detail: Variant;
  product_name: string;
  product_slug: string;
  design: number | null;
  print_file: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
}
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export interface Order {
  id: number;
  status: OrderStatus;
  address: number | null;
  address_snapshot: string;
  notes: string;
  subtotal: string;
  discount_code: string | null;
  discount_amount: string;
  discount_percent: number | null;
  total: string;
  items: OrderItem[];
  created_at: string;
}

export const ordersApi = {
  list: () => api.get<Order[]>("/orders/"),
  detail: (id: number) => api.get<Order>(`/orders/${id}/`),
};
