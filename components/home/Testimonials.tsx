"use client";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestimonials } from "@/lib/hooks/use-reviews";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

const bgColors = [
  "bg-crem",
  "bg-blue-50",
  "bg-background",
  "bg-green-50",
  "bg-yellow-50",
];
export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useTestimonials();

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            مشتریان ما می‌گویند
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            تجربه‌ی واقعی کسب‌وکارها
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              // ۲. انتخاب رنگ بر اساس ایندکس
              const cardColor = bgColors[i % bgColors.length];

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  // ۳. جایگزین کردن کلاس متغیر با bg-white
                  className={`${cardColor} rounded-3xl p-7 flex flex-col`}
                >
                  <Quote className="w-6 h-6 text-cobalt/30 mb-4" />
                  <div className="flex items-center gap-1 mb-3">
                    {Array(t.rating)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className="w-3.5 h-3.5 fill-soft-peach text-soft-peach"
                        />
                      ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-soft-blue/40 overflow-hidden flex-shrink-0">
                      {t.avatar && (
                        <img
                          src={`${NEXT_PUBLIC_MEDIA_URL}${t.avatar}`}
                          alt={t.customer_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.customer_title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
