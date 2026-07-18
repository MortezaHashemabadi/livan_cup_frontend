"use client";
import Link from "next/link";
import { ArrowUpLeft, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/lib/hooks/use-catalog";

const colorCycle = [
  "bg-soft-peach/30",
  "bg-soft-blue/30",
  "bg-cream",
  "bg-pale-mint/30",
];

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const mainCategories = categories.filter((c) => !c.is_accessory);

  if (!isLoading && mainCategories.length === 0) return null;

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            دسته‌بندی محصولات
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            همه چیزی که برای کسب‌وکار نوشیدنی‌تان نیاز دارید
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-[32px]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {mainCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`group block rounded-[32px] ${colorCycle[i % colorCycle.length]} p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-display font-bold text-2xl mb-2">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                      <ArrowUpLeft className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-white/40 flex items-center justify-center">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-muted-foreground/20" />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
