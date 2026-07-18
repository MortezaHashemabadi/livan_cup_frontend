"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartApi } from "../api/endpoints/cart";
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
      await Promise.all(
        order.items.map((item) =>
          cartApi.addItem({
            variant: item.variant,
            design: item.design ?? undefined,
            quantity: item.quantity,
          }),
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["cart"] });

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
    } catch {
      toast.error("سفارش مجدد ناموفق بود");
    } finally {
      setLoadingOrderId(null);
    }
  };

  return { reorder, loadingOrderId };
}
