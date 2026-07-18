import { api } from "../client";

export interface ProductReview {
  id: number;
  product: number;
  rating: number;
  comment: string;
  user_name: string;
  user_role: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_title: string;
  avatar: string | null;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  productReviews: (productId: number) =>
    api.get<ProductReview[]>(`/reviews/product-reviews/?product=${productId}`),
  createProductReview: (payload: {
    product: number;
    rating: number;
    comment: string;
  }) => api.post<ProductReview>("/reviews/product-reviews/", payload),
  testimonials: () => api.get<Testimonial[]>("/reviews/testimonials/"),
};
