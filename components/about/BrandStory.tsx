"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/3] rounded-[40px] overflow-hidden bg-soft-blue/20 order-2 lg:order-1 relative"
          >
            <Image
              src=""
              alt="داستان برند کاپ‌کرافت"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
              داستان ما
            </span>

            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-6">
              از یک کارگاه کوچک تا یک تولیدی معتبر
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4">
              کاپ‌کرافت با یک هدف ساده آغاز شد: تولید لیوان‌هایی که هم برای
              کسب‌وکار مقرون‌به‌صرفه باشند و هم ظاهری حرفه‌ای داشته باشند. امروز
              با دستگاه‌های تمام‌اتوماتیک، هزاران لیوان سفارشی را روزانه برای
              برندهای مختلف تولید می‌کنیم.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-4">
              ماموریت ما ساده است: به هر کسب‌وکاری — بزرگ یا کوچک — این امکان را
              بدهیم که با هزینه‌ای منطقی، هویت بصری خود را روی محصولی که هر روز
              دست مشتریانشان می‌رسد، به نمایش بگذارند.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              کیفیت برای ما مذاکره‌پذیر نیست؛ هر دسته تولید پیش از ارسال بازرسی
              می‌شود و رضایت مشتری همیشه معیار نهایی موفقیت ماست.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
