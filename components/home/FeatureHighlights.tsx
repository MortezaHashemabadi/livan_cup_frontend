"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Leaf, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    color: "bg-soft-blue",
    iconColor: "text-cobalt",
    heading: "طراحی با هوش مصنوعی",
    description: "در چند ثانیه با یک متن ساده، گرافیک آماده چاپ تولید کنید.",
  },
  {
    icon: Zap,
    color: "bg-soft-peach",
    iconColor: "text-orange-500",
    heading: "تحویل سریع",
    description: "از طرح تأیید شده تا در خانه شما، در کمتر از ۷ روز کاری.",
  },
  {
    icon: Leaf,
    color: "bg-pale-mint",
    iconColor: "text-emerald-600",
    heading: "مواد زیست‌محیطی",
    description: "گواهی FSC، قابل کمپوست و چاپ با جوهر آبی — برای زمین بهتر.",
  },
  {
    icon: ShieldCheck,
    color: "bg-secondary",
    iconColor: "text-cobalt",
    heading: "کیفیت تضمینی",
    description:
      "هر دسته پیش از ارسال بررسی می‌شود — وگرنه رایگان چاپ مجدد می‌کنیم.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            چرا ایران لیوان؟
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            ساخته شده برای برندهای مدرن
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-3xl p-7 border border-border hover:border-cobalt/20 hover:shadow-sm transition-all duration-200 flex flex-col gap-5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base mb-1.5">
                    {f.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
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
