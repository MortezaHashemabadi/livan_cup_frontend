"use client";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/endpoints/orders";

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
}
