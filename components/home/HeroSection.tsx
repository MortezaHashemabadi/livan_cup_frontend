"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCategories } from "@/lib/hooks/use-catalog";

// اگه بک‌اند برای خودِ دسته‌ی اصلی عکس نداشته باشه (image: null)، عکس اولین
// زیرمجموعه‌ای که عکس داره جایگزین می‌شه؛ اگه هیچ‌کدوم عکس نداشتن این استفاده می‌شه
const fallbackImage = "/hero/placeholder.jpg";

export default function HeroSection() {
  const { data: categories = [], isLoading } = useCategories();

  const mainCategories = categories.filter((c) => c.parent === null);

  if (isLoading || mainCategories.length === 0) {
    return (
      <section className="relative w-full pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-muted animate-pulse h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px]"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        {mainCategories.map((cat) => {
          const mainHref = `/products?category=${cat.slug}`;
          const subcategories = categories.filter((c) => c.parent === cat.id);
          const image =
            cat.image ||
            subcategories.find((s) => s.image)?.image ||
            fallbackImage;

          return (
            <div
              key={cat.id}
              className="group relative bg-muted h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] overflow-hidden"
            >
              {/* عکس - مستقیم فرزند کانتینر با ارتفاع ثابت، بدون کراپ و بدون کشیدگی */}
              <img
                src={image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* کلیک روی هرجای عکس به دسته اصلی می‌رود */}
              <Link
                href={mainHref}
                className="absolute inset-0 z-10"
                aria-label={cat.name}
              />

              {/* محتوای روی عکس */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8 lg:p-10 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <Link href={mainHref}>
                    <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl mb-2 lg:mb-3">
                      {cat.name}
                    </h2>
                  </Link>
                  {subcategories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/products?category=${sub.slug}`}
                          className="group/sub relative inline-block pb-2 text-white/90 text-xs sm:text-sm font-medium hover:text-white"
                        >
                          {sub.name}
                          <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-[width] duration-300 ease-out group-hover/sub:w-full" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={mainHref}
                  className="group/cta hidden sm:inline-flex items-center gap-1.5 text-white font-semibold text-sm shrink-0 self-end pb-1"
                >
                  مشاهده
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/cta:-translate-x-1.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

{/* <Image
  src={cat.image}
  alt={cat.name}
  fill
  priority
  sizes="(min-width: 768px) 50vw, 100vw"
  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
/>;
<div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10 flex items-end justify-between gap-4">
  <div className="min-w-0">
    <Link href={mainHref}>
      <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl mb-2 lg:mb-3">
        {cat.name}
      </h2>
    </Link>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {cat.subcategories.map((sub) => (
        <Link
          key={sub.slug}
          href={`/products?category=${sub.slug}`}
          className="group/sub relative inline-block pb-2 text-white/90 text-xs sm:text-sm font-medium hover:text-white"
        >
          {sub.label}
          <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-[width] duration-300 ease-out group-hover/sub:w-full" />
        </Link>
      ))}
    </div>
  </div>

  <Link
    href={mainHref}
    className="group/cta hidden sm:inline-flex items-center gap-1.5 text-white font-semibold text-sm shrink-0 self-end pb-1"
  >
    مشاهده
    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/cta:-translate-x-1.5" />
  </Link>
</div>; */}
