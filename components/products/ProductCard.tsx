"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import {
  getVariantImage,
  isNewVariant,
  type VariantListItem,
} from "@/lib/api/endpoints/catalog";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

export default function ProductCard({ item }: { item: VariantListItem }) {
  const { product, variant } = item;
  const { addItem } = useCart();
  const image = getVariantImage(variant);
  const startingPrice = variant.price_tiers.length
    ? Math.min(...variant.price_tiers.map((t) => parseFloat(t.unit_price)))
    : null;
  const variantLabel = variant.attribute_values
    .map((av) => av.value)
    .join(" · ");
  const isInStock = variant.stock_status === "in_stock";
  const isComingSoon = variant.stock_status === "coming_soon";
  const isNew = isNewVariant(variant);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;
    const minQty = variant.price_tiers[0]?.min_quantity ?? 1;
    addItem(variant.id, minQty);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link
        href={`/products/${product.slug}?variant=${variant.id}`}
        className="block"
      >
        <div className="rounded-3xl bg-cream overflow-hidden mb-4 aspect-square relative">
          {image ? (
            <img
              src={`${NEXT_PUBLIC_MEDIA_URL}${image}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}

          {!isInStock && (
            <div
              className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold ${
                isComingSoon
                  ? "bg-soft-peach text-orange-700"
                  : "bg-destructive text-white"
              }`}
            >
              {isComingSoon ? "به‌زودی موجود می‌شود" : "ناموجود"}
            </div>
          )}

          {isNew && (
            <div className="absolute top-4 left-4 bg-cobalt text-white rounded-full px-3 py-1 text-xs font-semibold">
              جدید
            </div>
          )}

          {isInStock && (
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button
                onClick={handleAdd}
                size="sm"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-5 text-xs font-medium shadow-lg"
              >
                افزودن به سبد
              </Button>
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-cobalt transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{variantLabel}</p>
          {startingPrice !== null && (
            <span className="font-heading font-bold text-lg">
              از {startingPrice.toLocaleString("fa-IR")} تومان
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
