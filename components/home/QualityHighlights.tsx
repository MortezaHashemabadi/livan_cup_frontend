"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Droplet,
  Globe2,
  ShieldCheck,
  Printer,
  Layers,
  Leaf,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";


interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: FeatureItem[] = [
  {
    icon: Droplet,
    title: "تولید بدون چسب",
    desc: "اتصال حرارتی لبه‌ها بدون مواد چسبنده شیمیایی.",
  },
  {
    icon: Globe2,
    title: "کاغذ ممتاز آلمانی",
    desc: "کاغذ وارداتی باکیفیت برای استحکام و ظاهر برتر.",
  },
  {
    icon: ShieldCheck,
    title: "مواد درجه غذایی",
    desc: "تمام مواد اولیه ایمن برای تماس مستقیم با غذا.",
  },
  {
    icon: Printer,
    title: "چاپ باکیفیت بالا",
    desc: "چاپ دیجیتال واضح با رنگ‌های پایدار.",
  },
  {
    icon: Layers,
    title: "طراحی ضد نشتی",
    desc: "ساختار لایه‌بندی‌شده برای جلوگیری از نشت.",
  },
  {
    icon: Leaf,
    title: "تولید سازگار با محیط‌زیست",
    desc: "مواد بازیافتی و کم‌اثر بر محیط‌زیست.",
  },
];

export default function QualityHighlights() {
  return (
    <section className="py-24 bg-[#F5F9F4] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[380px] h-[380px] rounded-full bg-pale-mint/15 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            کیفیت تولید
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            چرا محصولات ما؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تعهد ما به مواد اولیه ممتاز و استانداردهای تولید، در هر لیوانی که
            می‌سازیم مشهود است.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-3xl border border-border/50 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-cobalt/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-cobalt" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-1.5">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center"
        >
          {/* استفاده از لینک اختصاصی Next.js همراه با href */}
          <Link href="/quality">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-10 font-medium text-base border-border/60 hover:bg-secondary"
            >
              مشاهده جزئیات کیفیت تولید
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
