"use client";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const TIERS = [
  { min: 100, max: 499, discount: 0, label: "پایه" },
  { min: 500, max: 999, discount: 0.05, label: "۵٪ تخفیف" },
  { min: 1000, max: 2499, discount: 0.1, label: "۱۰٪ تخفیف" },
  { min: 2500, max: 4999, discount: 0.15, label: "۱۵٪ تخفیف" },
  { min: 5000, max: Infinity, discount: 0.2, label: "۲۰٪ تخفیف" },
];

export function getDiscountedPrice(basePrice: number, qty: number) {
  const tier = [...TIERS].reverse().find((t) => qty >= t.min) || TIERS[0];
  return basePrice * (1 - tier.discount);
}

export default function BulkPricingCalculator({
  basePrice,
  quantity,
}: {
  basePrice: number;
  quantity: number;
}) {
  const activeTier =
    [...TIERS].reverse().find((t) => quantity >= t.min) || TIERS[0];

  return (
    <div className="bg-secondary rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Tag className="w-4 h-4 text-cobalt" />
        <h3 className="font-heading font-semibold text-sm">تعرفه‌ی پله‌ای</h3>
      </div>

      <div className="space-y-2">
        {TIERS.map((tier, i) => {
          const isActive = tier === activeTier;
          const price = basePrice * (1 - tier.discount);
          const rangeLabel =
            tier.max === Infinity
              ? `${tier.min.toLocaleString("fa-IR")}+ عدد`
              : `${tier.min.toLocaleString("fa-IR")} – ${tier.max.toLocaleString("fa-IR")} عدد`;

          return (
            <motion.div
              key={i}
              animate={{
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1 : 0.98,
              }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                isActive
                  ? "bg-cobalt/10 border border-cobalt/20"
                  : "bg-background/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {rangeLabel}
                </span>
                {tier.discount > 0 && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? "bg-cobalt text-white" : "bg-pale-mint text-foreground/60"}`}
                  >
                    {tier.label}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`font-heading font-bold text-sm ${isActive ? "text-cobalt" : "text-foreground"}`}
                >
                  {price.toLocaleString("fa-IR")} تومان
                </span>
                <span className="text-xs text-muted-foreground mr-1">/عدد</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeTier.discount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between bg-pale-mint rounded-2xl px-4 py-3"
        >
          <span className="text-sm font-medium text-foreground/80">
            سود شما در {quantity.toLocaleString("fa-IR")} عدد
          </span>
          <span className="font-heading font-bold text-sm text-foreground">
            {(basePrice * activeTier.discount * quantity).toLocaleString(
              "fa-IR",
            )}{" "}
            تومان
          </span>
        </motion.div>
      )}
    </div>
  );
}
