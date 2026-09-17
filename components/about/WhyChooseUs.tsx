"use client";

import { motion } from "framer-motion";
import {
  Layers,
  PackageCheck,
  ShieldCheck,
  Printer,
  Cog,
  Leaf,
} from "lucide-react";

type Feature = {
  icon: React.ElementType;
  color: string;
  iconColor: string;
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    icon: ShieldCheck,
    color: "bg-soft-blue",
    iconColor: "text-cobalt",
    title: "اتصال اولتراسونیک، بدون چسب",
    desc: "لیوان‌ها بدون استفاده از چسب تولید می‌شوند؛ اتصال اولتراسونیک برای استفاده مطمئن‌ در کنار نوشیدنی‌های گرم.",
  },
  {
    icon: PackageCheck,
    color: "bg-soft-peach",
    iconColor: "text-orange-500",
    title: "کاغذ وارداتی درجه یک",
    desc: "استفاده از خمیر کاغذ وارداتی با کیفیت بالا برای دوام و ظاهر بهتر.",
  },
  {
    icon: ShieldCheck,
    color: "bg-pale-mint",
    iconColor: "text-emerald-600",
    title: "مواد غذایی مطمئن",
    desc: "تمام مواد اولیه استاندارد تماس با مواد غذایی را دارند.",
  },
  {
    icon: Printer,
    color: "bg-soft-peach",
    iconColor: "text-orange-500",
    title: "چاپی که برندتان را درست نشان می‌دهد",
    desc: "اجرای دقیق طرح و رنگ برای اینکه لوگو و هویت بصری برند شما روی محصول تمیز و حرفه‌ای دیده شود.",
  },
  {
    icon: Leaf,
    color: "bg-soft-blue",
    iconColor: "text-emerald-600",
    title: "تمرکز روی نیاز کسب‌وکار",
    desc: "محصول را صرفاً برای تولید نمی‌کنیم؛ هدف این است که انتخاب نهایی با نوع استفاده، سبک برند و نیاز واقعی کسب‌وکار شما هماهنگ باشد.",
  },
  {
    icon: PackageCheck,
    color: "bg-cream",
    iconColor: "text-amber-600",
    title: "یک مجموعه برای برند شما",
    desc: "لیوان بیرون‌بر و بگ پارچه‌ای را می‌توانید با یک هویت بصری یکپارچه سفارش دهید و تجربه برندتان را هماهنگ کنید.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            چرا لیوان کاپس؟
          </span>

          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            دلایلی برای انتخاب ما
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;

            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-3xl p-7 border border-border hover:border-cobalt/20 hover:shadow-sm transition-all duration-200 flex flex-col gap-5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base mb-1.5">
                    {f.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
