"use client";
import { useTopSellingVariants } from "@/lib/hooks/use-catalog";
import { topSellingToVariantItems } from "@/lib/api/endpoints/catalog";
import ProductCard from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellers() {
  const { data: topSelling = [], isLoading, isError } = useTopSellingVariants();
  const variantItems = topSellingToVariantItems(topSelling);

  if (isError) return null;
  if (!isLoading && variantItems.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-6 sm:mb-8">
          پرفروش‌ترین‌ها
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-3xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", direction: "rtl" }}
            className="w-full"
          >
            <CarouselContent className="-me-4">
              {variantItems.map((item) => (
                <CarouselItem
                  key={item.variant.id}
                  className="pe-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
