"use client";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/lib/hooks/use-catalog";
import type { AttributeGroup } from "@/lib/api/endpoints/catalog";

interface Props {
  category: string;
  onCategoryChange: (category: string) => void;
  attributeGroups: AttributeGroup[];
  attributeFilters: Record<string, string>;
  onAttributeChange: (slug: string, value: string) => void;
  onClearAll: () => void;
}

function FilterContent({
  category,
  onCategoryChange,
  attributeGroups,
  attributeFilters,
  onAttributeChange,
  onClearAll,
}: Props) {
  const { data: categories = [] } = useCategories();
  const hasActiveFilters =
    category || Object.values(attributeFilters).some(Boolean);

  return (
    <div className="space-y-8">
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="text-sm text-cobalt hover:underline flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          حذف همه‌ی فیلترها
        </button>
      )}

      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">دسته‌بندی</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                onCategoryChange(category === cat.slug ? "" : cat.slug)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat.slug
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {attributeGroups.map((group) => (
        <div key={group.slug}>
          <h4 className="font-heading font-semibold text-sm mb-3">
            {group.label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => (
              <button
                key={value}
                onClick={() =>
                  onAttributeChange(
                    group.slug,
                    attributeFilters[group.slug] === value ? "" : value,
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  attributeFilters[group.slug] === value
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductFilters(props: Props) {
  const activeCount =
    (props.category ? 1 : 0) +
    Object.values(props.attributeFilters).filter(Boolean).length;

  return (
    <>
      <div className="hidden lg:block">
        <FilterContent {...props} />
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              فیلترها
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cobalt text-white text-xs flex items-center justify-center">
                  {activeCount.toLocaleString("fa-IR")}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-6">
            <SheetHeader>
              <SheetTitle className="font-heading">فیلترها</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
