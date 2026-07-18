"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { reviewsApi } from "../api/endpoints/reviews";

export function useProductReviews(productId: number | undefined) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => reviewsApi.productReviews(productId as number),
    enabled: !!productId,
  });
}

export function useCreateProductReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      product: number;
      rating: number;
      comment: string;
    }) => reviewsApi.createProductReview(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.product],
      });
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: reviewsApi.testimonials,
  });
}
