"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/use-catalog";
import {
  getProductListAttributeGroups,
} from "@/lib/api/endpoints/catalog";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [attributeFilters, setAttributeFilters] = useState<
    Record<string, string>
  >({});
  const { data: products = [], isLoading } = useProducts(category || undefined);

  const attributeGroups = useMemo(
    () => getProductListAttributeGroups(products),
    [products],
  );
  
  const variantItems = useMemo(() => {
    const active = Object.entries(attributeFilters).filter(([, v]) => v);
    return products.flatMap((product) =>
      product.variants
        .filter((variant) => {
          if (active.length === 0) return true;
          return active.every(([slug, value]) =>
            variant.attribute_values.some(
              (av) => av.attribute_slug === slug && av.value === value,
            ),
          );
        })
        .map((variant) => ({ product, variant })),
    );
  }, [products, attributeFilters]);

  const handleCategoryChange = (next: string) => {
    setCategory(next);
    setAttributeFilters({});
  };

  const handleAttributeChange = (slug: string, value: string) => {
    setAttributeFilters((prev) => ({ ...prev, [slug]: value }));
  };

  const handleClearAll = () => {
    setCategory("");
    setAttributeFilters({});
  };

  return (
    <div className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            محصولات
          </h1>
          <p className="text-lg text-muted-foreground">
            کاتالوگ کامل لیوان‌ها و لوازم جانبی قابل سفارشی‌سازی
          </p>
        </div>

        <div className="flex lg:gap-12">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <ProductFilters
                category={category}
                onCategoryChange={handleCategoryChange}
                attributeGroups={attributeGroups}
                attributeFilters={attributeFilters}
                onAttributeChange={handleAttributeChange}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-6">
              <ProductFilters
                category={category}
                onCategoryChange={handleCategoryChange}
                attributeGroups={attributeGroups}
                attributeFilters={attributeFilters}
                onAttributeChange={handleAttributeChange}
                onClearAll={handleClearAll}
              />
            </div>

            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "در حال بارگذاری..."
                  : `${variantItems.length.toLocaleString("fa-IR")} محصول`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-square rounded-3xl mb-4" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
              </div>
            ) : variantItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-2">محصولی یافت نشد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {variantItems.map((item) => (
                  <ProductCard key={item.variant.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
