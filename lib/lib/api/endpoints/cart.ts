import { api } from "../client";
import type { Variant } from "./catalog";
import type { Order } from "./orders";

export interface SelectedOption {
  group_id: number;
  group_name: string;
  choice_id: number;
  choice_name: string;
  price_modifier: number;
}

export interface CartItem {
  id: number;
  variant: number;
  variant_detail: Variant;
  product_name: string;
  product_slug: string;
  design: number | null;
  print_file: string | null;
  quantity: number;
  /** حداقل تیراژ سفارش این محصول (null اگر قیمتی ثبت نشده) */
  min_quantity: number | null;
  /** پیام خطا اگر آیتم قابل خرید نباشد (مثلاً زیر حداقل سفارش) */
  error: string | null;
  unit_price: number | null;
  subtotal: number | null;
  selected_options: SelectedOption[];
  fabric_color: string;
  print_color: string;
  top_color: string;
  bottom_color: string;
}

export interface CartIssue {
  item_id: number;
  product_name: string;
  message: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  discount_code: string | null;
  discount_amount: number;
  total: number;
  /** false اگر سبد خالی باشد یا آیتمی قابل خرید نباشد */
  can_checkout: boolean;
  issues: CartIssue[];
}

export interface AddCartItemPayload {
  variant: number;
  design?: number;
  quantity: number;
  print_file?: File;
  selected_option_ids?: number[];
  fabric_color?: string;
  print_color?: string;
  top_color?: string;
  bottom_color?: string;
}

export const cartApi = {
  get: () => api.get<Cart>("/cart/"),
  addItem: (payload: AddCartItemPayload) => {
    if (payload.print_file) {
      const formData = new FormData();
      formData.append("variant", String(payload.variant));
      formData.append("quantity", String(payload.quantity));
      if (payload.design) formData.append("design", String(payload.design));
      formData.append("print_file", payload.print_file);
      // DRF ListField در multipart هر مقدار را جدا می‌خواند (نه رشته‌ی JSON)
      payload.selected_option_ids?.forEach((id) =>
        formData.append("selected_option_ids", String(id)),
      );
      if (payload.fabric_color) {
        formData.append("fabric_color", payload.fabric_color);
      }
      if (payload.print_color) {
        formData.append("print_color", payload.print_color);
      }
      if (payload.top_color) formData.append("top_color", payload.top_color);
      if (payload.bottom_color) {
        formData.append("bottom_color", payload.bottom_color);
      }
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

export const checkoutApi = {
  checkout: (addressId: number, notes?: string) =>
    api.post<Order>("/cart/checkout/", { address_id: addressId, notes }),
};
