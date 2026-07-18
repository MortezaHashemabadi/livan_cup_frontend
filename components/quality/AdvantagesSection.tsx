"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Droplet,
  Globe2,
  ShieldCheck,
  Layers,
  Printer,
  Leaf,
  Weight,
  Thermometer,
  LucideIcon,
} from "lucide-react";

// تعریف اینترفیس برای تایپ‌دهی آرایه مزیت‌ها
interface AdvantageItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const advantages: AdvantageItem[] = [
  {
    icon: Droplet,
    title: "تولید بدون چسب",
    desc: "اتصال حرارتی لبه‌ها بدون استفاده از چسب شیمیایی، برای ایمنی و پایداری بیشتر.",
  },
  {
    icon: Globe2,
    title: "کاغذ وارداتی آلمانی",
    desc: "استفاده از کاغذ باکیفیت اروپایی برای استحکام و ظاهری ممتاز.",
  },
  {
    icon: ShieldCheck,
    title: "مواد درجه غذایی",
    desc: "تمامی مواد اولیه دارای تأییدیه ایمنی برای تماس مستقیم با مواد غذایی هستند.",
  },
  {
    icon: Layers,
    title: "ساختار ضد نشتی",
    desc: "لایه‌بندی دقیق برای جلوگیری از نشت مایعات و حفظ کیفیت نوشیدنی.",
  },
  {
    icon: Printer,
    title: "چاپ ممتاز",
    desc: "چاپ دیجیتال با وضوح بالا و رنگ‌های پایدار روی سطح لیوان.",
  },
  {
    icon: Leaf,
    title: "مواد سازگار با محیط‌زیست",
    desc: "گزینه‌های بازیافتی و قابل کمپوست برای کاهش اثرات زیست‌محیطی.",
  },
  {
    icon: Weight,
    title: "گراماژ کاغذ بالا",
    desc: "کاغذ ضخیم‌تر برای استحکام بیشتر و حس لمسی پریمیوم.",
  },
  {
    icon: Thermometer,
    title: "مقاومت حرارتی بالا",
    desc: "مقاوم در برابر نوشیدنی‌های داغ بدون تغییر شکل یا نشت حرارت.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="py-24 bg-[#F3F7F9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            مزیت‌های تولید
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            چرا محصولات ما متفاوت است
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-3xl border border-border/50 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-cobalt/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-cobalt" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
