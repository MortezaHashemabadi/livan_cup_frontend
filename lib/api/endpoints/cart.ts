import { api } from "../client";
import type { Variant } from "./catalog";

export interface CartItem {
  id: number;
  variant: number;
  variant_detail: Variant;
  product_name: string;
  product_slug: string;
  design: number | null;
  print_file: string | null;
  quantity: number;
  unit_price: number | null;
  subtotal: number | null;
}
export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  discount_code: string | null;
  discount_amount: number;
  total: number;
}

export const cartApi = {
  get: () => api.get<Cart>("/cart/"),
  addItem: (payload: {
    variant: number;
    design?: number;
    quantity: number;
    print_file?: File;
  }) => {
    if (payload.print_file) {
      const formData = new FormData();
      formData.append("variant", String(payload.variant));
      formData.append("quantity", String(payload.quantity));
      if (payload.design) formData.append("design", String(payload.design));
      formData.append("print_file", payload.print_file);
      return api.post<CartItem>("/cart/items/", formData, { isFormData: true });
    }
    return api.post<CartItem>("/cart/items/", payload);
  },
  updateItem: (id: number, payload: { quantity: number }) =>
    api.patch<CartItem>(`/cart/items/${id}/`, payload),
  removeItem: (id: number) => api.delete(`/cart/items/${id}/`),
  applyDiscount: (code: string) =>
    api.post<Cart>("/cart/apply-discount/", { code }),
  removeDiscount: () => api.post<Cart>("/cart/remove-discount/"),
};

export interface Order {
  id: number;
  status: string;
  address_snapshot: Record<string, unknown>;
  subtotal: number;
  discount_amount: number;
  total: number;
  items: unknown[];
  created_at: string;
}

export const checkoutApi = {
  checkout: (addressId: number, notes?: string, designConsultation?: boolean) =>
    api.post<Order>("/cart/checkout/", { address_id: addressId, notes }),
};