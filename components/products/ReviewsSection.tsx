"use client";
import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import {
  useProductReviews,
  useCreateProductReview,
} from "@/lib/hooks/use-reviews";
import type { ApiError } from "@/lib/api/types";

function StarRating({
  value,
  onChange,
  readOnly,
  size = "w-4 h-4",
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(i)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`${size} ${i <= value ? "fill-soft-peach text-soft-peach" : "text-border"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }: { productId: number }) {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const createReview = useCreateProductReview();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!comment.trim()) {
      toast.error("متن نظر را وارد کنید");
      return;
    }
    try {
      await createReview.mutateAsync({ product: productId, rating, comment });
      toast.success("نظر شما ثبت شد");
      setShowForm(false);
      setComment("");
    } catch (err) {
      const e = err as ApiError;
      const payload = e.payload as any;
      const message =
        payload?.non_field_errors?.[0] ||
        payload?.detail ||
        "ثبت نظر ناموفق بود";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-heading font-semibold text-lg mb-1">
            نظرات مشتریان
          </h3>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(avgRating)} readOnly />
              <span className="text-sm text-muted-foreground mr-2">
                {avgRating.toFixed(1)} از{" "}
                {reviews.length.toLocaleString("fa-IR")} نظر
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">هنوز نظری ثبت نشده</p>
          )}
        </div>
        {!showForm && (
          <Button
            onClick={() =>
              isAuthenticated ? setShowForm(true) : openAuthModal()
            }
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            ثبت نظر
          </Button>
        )}
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-secondary/40 rounded-2xl p-5 mb-6 space-y-4 overflow-hidden"
        >
          <StarRating value={rating} onChange={setRating} size="w-6 h-6" />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="تجربه‌ی خودتون رو بنویسید..."
            className="bg-white rounded-xl min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={createReview.isPending}
              size="sm"
              className="rounded-full bg-foreground hover:bg-foreground/90 text-background"
            >
              {createReview.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "ثبت"
              )}
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              انصراف
            </Button>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        reviews.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-cream rounded-2xl p-5"
              >
                <StarRating value={review.rating} readOnly size="w-3.5 h-3.5" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 mt-3">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="text-sm font-medium">{review.user_name}</p>
                {review.user_role && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.user_role}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
