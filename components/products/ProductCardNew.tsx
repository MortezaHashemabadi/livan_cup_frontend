"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductCardData } from "@/lib/api/endpoints/catalog";

// این کارت فقط مخصوص صفحه محصولات (endpoint جدید /catalog/product-cards/) هست.
// جای دیگه‌ای (Home BestSellers و ...) همچنان از ProductCard قدیمی استفاده می‌کنه.
export default function ProductCardNew({ item }: { item: ProductCardData }) {
  const priceFrom = parseFloat(item.price_from);
  const priceTo = parseFloat(item.price_to);
  const hasRange = priceFrom !== priceTo;
  const filterLabel = Object.values(item.filter_data).join(" · ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={item.link} className="block">
        <div className="rounded-3xl bg-cream overflow-hidden mb-4 aspect-square relative">
          {item.primary_image ? (
            <>
              <img
                src={item.primary_image}
                alt={item.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  item.hover_image
                    ? "group-hover:opacity-0"
                    : "transition-transform group-hover:scale-105"
                }`}
              />
              {item.hover_image && (
                <img
                  src={item.hover_image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-cobalt transition-colors">
            {item.name}
          </h3>
          {filterLabel && (
            <p className="text-xs text-muted-foreground mb-2">{filterLabel}</p>
          )}
          {item.options.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {item.options.flatMap((opt) =>
                opt.values.map((value) => (
                  <span
                    key={`${opt.slug}-${value}`}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {value}
                  </span>
                )),
              )}
            </div>
          )}
          <span className="font-heading font-bold text-lg">
            {hasRange ? "از " : ""}
            {priceFrom.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
