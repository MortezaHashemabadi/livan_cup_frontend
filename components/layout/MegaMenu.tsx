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

/**
 * مگا منوی «محصولات».
 * دسته‌های اصلی (parent === null) ستون‌ها هستند و زیرمجموعه‌هاشان لینک‌های داخل ستون.
 * اگر دسته‌ای زیرمجموعه نداشت، خودش به‌صورت لینک نمایش داده می‌شود.
 */
export default function MegaMenu({ categories, loading, onNavigate }: Props) {
  const roots = categories.filter((c) => c.parent === null);
  const childrenOf = (id: number) => categories.filter((c) => c.parent === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full z-50 bg-white border-t border-border/50 shadow-[0_24px_40px_-12px_rgba(0,0,0,0.12)] rounded-b-[32px]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-[1fr_280px] gap-10">
        {/* ستون‌های دسته‌بندی */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 content-start">
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
                      className="font-display font-bold text-[15px] text-foreground hover:text-cobalt transition-colors"
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
                              className="block py-1 text-sm text-muted-foreground hover:text-foreground hover:translate-x-[-2px] transition-all"
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
        <div className="flex flex-col gap-3">
          <Link
            href="/designer"
            onClick={onNavigate}
            className="rounded-3xl bg-soft-blue/40 p-6 hover:bg-soft-blue/60 transition-colors"
          >
            <Sparkles className="w-6 h-6 text-cobalt mb-3" />
            <p className="font-display font-bold mb-1">طراحی لیوان اختصاصی</p>
            <p className="text-sm text-muted-foreground">
              طرح خودت رو با کمک هوش مصنوعی بساز
            </p>
          </Link>
          <Link
            href="/products"
            onClick={onNavigate}
            className="flex items-center justify-between rounded-2xl bg-secondary px-5 py-3.5 text-sm font-medium hover:bg-secondary/70 transition-colors"
          >
            مشاهده‌ی همه‌ی محصولات
            <ArrowUpLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
