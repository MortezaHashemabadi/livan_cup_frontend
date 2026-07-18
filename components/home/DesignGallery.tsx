"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGallery } from "@/lib/hooks/use-gallery";


export default function DesignGallery() {
  const { data: images = [], isLoading } = useGallery();
  const items = images.slice(0, 6);

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cobalt/10 text-cobalt text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              ساخته شده با ایران لیوان
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
              طرح‌های واقعی،
              <br />
              برندهای واقعی.
            </h2>
          </div>
          <Link href="/designer">
            <Button
              variant="outline"
              className="rounded-full h-12 px-6 gap-2 text-sm font-medium flex-shrink-0"
            >
              طرح خود را بساز
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-cream"
              >
                <img
                  src={item.image}
                  alt={item.title || "طرح گالری"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 left-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-heading font-semibold text-background text-base mb-1">
                    {item.title}
                  </p>
                  {item.tag && (
                    <p className="text-background/70 text-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {item.tag}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
