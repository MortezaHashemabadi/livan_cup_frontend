"use client";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "../api/endpoints/catalog";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: catalogApi.categories });
}
export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ["products", categorySlug],
    queryFn: () => catalogApi.products(categorySlug),
  });
}
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => catalogApi.product(slug),
    enabled: !!slug,
  });
}
