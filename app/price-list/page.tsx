"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCategories, useProducts } from "@/lib/hooks/use-catalog";
import {
  flattenToVariants,
  type VariantListItem,
} from "@/lib/api/endpoints/catalog";
import PriceMatrixTable from "@/components/products/PriceMatrixTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function startingPriceOf(item: VariantListItem): number {
  return item.variant.price_tiers.length
    ? Math.min(...item.variant.price_tiers.map((t) => parseFloat(t.unit_price)))
    : Infinity;
}

export default function PriceListPage() {
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const mainCategories = useMemo(
    () => categories.filter((c) => c.parent === null),
    [categories],
  );

  const variantItems = useMemo(() => flattenToVariants(products), [products]);

  const rootSlugOf = (categorySlug: string): string => {
    let current = categories.find((c) => c.slug === categorySlug);
    while (current && current.parent !== null) {
      const parent = categories.find((c) => c.id === current!.parent);
      if (!parent) break;
      current = parent;
    }
    return current?.slug ?? categorySlug;
  };

  // دسته‌بندی بر اساس کتگوری برگ (leaf) خودِ محصول — هر leaf یه جدول جدا می‌شه
  const itemsByLeaf = useMemo(() => {
    const map: Record<string, VariantListItem[]> = {};
    variantItems.forEach((item) => {
      const leafSlug = item.product.category_slug;
      if (!map[leafSlug]) map[leafSlug] = [];
      map[leafSlug].push(item);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => startingPriceOf(a) - startingPriceOf(b)),
    );
    return map;
  }, [variantItems]);

  // leaf-slug ها رو زیر تب دسته‌ی ریشه‌شون گروه می‌کنیم
  const leavesByRoot = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.keys(itemsByLeaf).forEach((leafSlug) => {
      const rootSlug = rootSlugOf(leafSlug);
      if (!map[rootSlug]) map[rootSlug] = [];
      map[rootSlug].push(leafSlug);
    });
    return map;
  }, [itemsByLeaf, categories]);

  const isLoading = loadingCategories || loadingProducts;
  const currentTab = activeTab ?? mainCategories[0]?.slug ?? "";

  return (
    <div className="pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            لیست قیمت
          </h1>
          <p className="text-lg text-muted-foreground">
            قیمت محصولات بر اساس تیراژ سفارش متفاوت است؛ بازه‌ی قیمت هر واریانت
            را در جدول زیر می‌بینید.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-72 rounded-full" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : mainCategories.length === 0 ? (
          <p className="text-muted-foreground">دسته‌بندی‌ای یافت نشد.</p>
        ) : (
          <Tabs value={currentTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto bg-transparent p-0 gap-2 justify-start mx-auto">
              {mainCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.slug}
                  className="h-auto rounded-full border-none px-5 py-2.5 text-sm font-medium bg-secondary text-muted-foreground shadow-none transition-all hover:text-foreground data-active:bg-foreground data-active:text-background data-active:shadow-none after:hidden"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {mainCategories.map((cat) => {
              const leafSlugs = leavesByRoot[cat.slug] ?? [];
              return (
                <TabsContent
                  key={cat.id}
                  value={cat.slug}
                  className="space-y-10"
                >
                  {leafSlugs.length === 0 ? (
                    <p className="text-muted-foreground">
                      محصولی در این دسته یافت نشد.
                    </p>
                  ) : (
                    leafSlugs.map((leafSlug) => {
                      const leafCategory = categories.find(
                        (c) => c.slug === leafSlug,
                      );
                      const items = itemsByLeaf[leafSlug] ?? [];
                      const axes = leafCategory?.price_table_axes;

                      return (
                        <div key={leafSlug} dir="rtl">
                          <h2 className="font-heading font-bold text-xl mb-4 ">
                            {leafCategory?.name ?? leafSlug}
                          </h2>
                          <div className="bg-cream rounded-3xl overflow-hidden">
                            {axes ? (
                              <PriceMatrixTable items={items} axes={axes} />
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-right">
                                      نام محصول
                                    </TableHead>
                                    <TableHead className="text-right">
                                      مشخصات
                                    </TableHead>
                                    <TableHead className="text-right">
                                      قیمت
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {items.map((item) => {
                                    const { product, variant } = item;
                                    const variantLabel =
                                      variant.attribute_values
                                        .map((av) => av.value)
                                        .join(" · ");
                                    const startingPrice = variant.price_tiers
                                      .length
                                      ? Math.min(
                                          ...variant.price_tiers.map((t) =>
                                            parseFloat(t.unit_price),
                                          ),
                                        )
                                      : null;
                                    return (
                                      <TableRow key={variant.id}>
                                        <TableCell className="font-medium">
                                          <Link
                                            href={`/products/${product.slug}?variant=${variant.id}`}
                                            className="hover:text-cobalt transition-colors"
                                          >
                                            {product.name}
                                          </Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                          {variantLabel}
                                        </TableCell>
                                        <TableCell>
                                          {startingPrice !== null ? (
                                            <>
                                              از{" "}
                                              {startingPrice.toLocaleString(
                                                "fa-IR",
                                              )}{" "}
                                              تومان
                                            </>
                                          ) : (
                                            "—"
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        <div className="mt-10 bg-secondary/40 rounded-3xl p-6 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground mb-1">توضیحات</p>
          <p>
            قیمت‌های جدول بر اساس کمترین تیراژ سفارش هر واریانت محاسبه شده و
            ممکن است با افزایش تعداد سفارش کاهش یابد.
          </p>
          <p>قیمت‌ها به تومان و بدون احتساب هزینه‌ی ارسال است.</p>
          <p>
            برای مشاهده‌ی جزئیات کامل و گزینه‌های هر محصول، روی نام آن کلیک
            کنید.
          </p>
        </div>
      </div>
    </div>
  );
}
