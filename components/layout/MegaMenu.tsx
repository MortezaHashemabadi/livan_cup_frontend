"use client";
import Link from "next/link";
import { ArrowUpLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/lib/api/endpoints/catalog";

interface Props {
  categories: Category[];
  loading: boolean;
  onNavigate: () => void;
}

// حداکثر تعداد ستون دسته‌ها کنار هم (بیشتر از این می‌رود ردیف بعدی)
const MAX_COLUMNS = 3;

/**
 * مگا منوی «محصولات» — عرضش فقط به اندازه‌ی محتوای داخلش است
 * و زیر لینک «محصولات» باز می‌شود (والدش باید `relative` باشد).
 */
export default function MegaMenu({ categories, loading, onNavigate }: Props) {
  const roots = categories.filter((c) => c.parent === null);
  const childrenOf = (id: number) => categories.filter((c) => c.parent === id);
  const columns = loading
    ? 3
    : Math.min(Math.max(roots.length, 1), MAX_COLUMNS);

  return (
    // pt-2: فاصله‌ی بین هدر و کارت که هاور رو قطع نکنه
    <div className="absolute right-0 top-full z-50 pt-2">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top right" }}
        className="w-max max-w-[calc(100vw-3rem)] rounded-3xl bg-white border border-border/50 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] p-6 flex gap-8"
      >
        {/* ستون‌های دسته‌بندی */}
        <div
          className="grid gap-x-10 gap-y-6 content-start"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(130px, auto))`,
          }}
        >
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            : roots.map((root) => {
                const kids = childrenOf(root.id);
                return (
                  <div key={root.id}>
                    <Link
                      href={`/products?category=${root.slug}`}
                      onClick={onNavigate}
                      className="font-display font-bold text-[15px] text-foreground hover:text-cobalt transition-colors whitespace-nowrap"
                    >
                      {root.name}
                    </Link>
                    {kids.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {kids.map((kid) => (
                          <li key={kid.id}>
                            <Link
                              href={`/products?category=${kid.slug}`}
                              onClick={onNavigate}
                              className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                            >
                              {kid.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
        </div>

        {/* کارت تبلیغاتی / میانبر */}
        <div className="flex w-56 shrink-0 flex-col gap-3 border-s border-border/50 ps-8">
          <Link
            href="/designer"
            onClick={onNavigate}
            className="rounded-2xl bg-soft-blue/40 p-5 hover:bg-soft-blue/60 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-cobalt mb-2" />
            <p className="font-display font-bold text-sm mb-1">
              طراحی لیوان اختصاصی
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              طرح خودت رو با کمک هوش مصنوعی بساز
            </p>
          </Link>
          <Link
            href="/products"
            onClick={onNavigate}
            className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm font-medium hover:bg-secondary/70 transition-colors"
          >
            همه‌ی محصولات
            <ArrowUpLeft className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
