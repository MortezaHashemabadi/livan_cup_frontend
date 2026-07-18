"use client";
import Link from "next/link";
import { ArrowUpLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { RelatedVariant } from "@/lib/api/endpoints/catalog";
import {
  getRelatedVariantImage,
  getRelatedVariantStartingPrice,
} from "@/lib/api/endpoints/catalog";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

export default function RecommendedProducts({
  variants,
}: {
  variants: RelatedVariant[];
}) {
  if (!variants.length) return null;

  return (
    <div className="bg-white rounded-3xl border border-border/50 p-6">
      <h3 className="font-heading font-semibold text-lg mb-5">
        محصولات تکمیلی
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {variants.map((variant, i) => {
          const image = getRelatedVariantImage(variant);
          const label = variant.attribute_values
            .map((av) => av.value)
            .join(" · ");
          const startingPrice = getRelatedVariantStartingPrice(variant);
          return (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/products/${variant.product_slug}?variant=${variant.id}`}
                className="group block text-center"
              >
                <div className="rounded-2xl bg-cream overflow-hidden aspect-square mb-3 relative">
                  {image ? (
                    <img
                      src={`${NEXT_PUBLIC_MEDIA_URL}${image}`}
                      alt={variant.product_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs font-medium group-hover:text-cobalt transition-colors">
                  {variant.product_name}
                </p>
                {label && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {label}
                  </p>
                )}
                {startingPrice !== null && (
                  <p className="text-xs font-heading font-bold mt-1">
                    {startingPrice.toLocaleString("fa-IR")} تومان
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
