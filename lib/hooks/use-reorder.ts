"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartApi } from "../api/endpoints/cart";
import { getDefaultOptionChoiceIds } from "../api/endpoints/catalog";
import { getApiErrorMessage } from "../api/errors";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "../api/endpoints/orders";

export function useReorder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

  const reorder = async (order: Order) => {
    setLoadingOrderId(order.id);
    try {
      // یکی‌یکی اضافه می‌کنیم تا سبد هم‌زمان ساخته/ادغام نشود
      for (const item of order.items) {
        // سفارش‌های قدیمی آپشن ذخیره‌شده ندارند؛ برای آن‌ها گزینه‌های پیش‌فرض
        const choiceIds = item.selected_options?.length
          ? item.selected_options.map((o) => o.choice_id)
          : getDefaultOptionChoiceIds(item.variant_detail);
        await cartApi.addItem({
          variant: item.variant,
          design: item.design ?? undefined,
          quantity: item.quantity,
          selected_option_ids: choiceIds,
          fabric_color: item.fabric_color || undefined,
          print_color: item.print_color || undefined,
          top_color: item.top_color || undefined,
          bottom_color: item.bottom_color || undefined,
        });
      }

      sessionStorage.setItem("reorder_notes", order.notes || "");

      if (order.address) {
        sessionStorage.setItem("reorder_address_id", String(order.address));
        sessionStorage.setItem("reorder_step", "3");
      } else {
        sessionStorage.removeItem("reorder_address_id");
        sessionStorage.setItem("reorder_step", "1");
        toast.info("آدرس قبلی دیگر در دسترس نیست، لطفاً آدرس جدید انتخاب کنید");
      }

      router.push("/checkout?reorder=1");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "سفارش مجدد ناموفق بود"));
    } finally {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setLoadingOrderId(null);
    }
  };

  return { reorder, loadingOrderId };
}
