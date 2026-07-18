"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

type ContactItem = {
  icon: React.ElementType;
  color: string;
  iconColor: string;
  title: string;
  value: string;
};

const items: ContactItem[] = [
  {
    icon: Phone,
    color: "bg-soft-blue",
    iconColor: "text-cobalt",
    title: "تلفن تماس",
    value: "۰۲۱-۱۲۳۴۵۶۷۸",
  },
  {
    icon: MessageCircle,
    color: "bg-pale-mint",
    iconColor: "text-emerald-600",
    title: "واتس‌اپ",
    value: "۰۹۱۲۳۴۵۶۷۸۹",
  },
  {
    icon: Mail,
    color: "bg-soft-peach",
    iconColor: "text-orange-500",
    title: "ایمیل",
    value: "info@cupcraft.ir",
  },
  {
    icon: MapPin,
    color: "bg-cream",
    iconColor: "text-amber-600",
    title: "آدرس کارخانه",
    value: "تهران، شهرک صنعتی، خیابان تولید، پلاک ۱۲",
  },
  {
    icon: Clock,
    color: "bg-secondary",
    iconColor: "text-cobalt",
    title: "ساعات کاری",
    value: "شنبه تا پنجشنبه، ۸ تا ۱۷",
  },
];

export default function ContactInfo() {
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
            تماس با ما
          </span>

          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            راه‌های ارتباط با ما
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-3xl p-7 border border-border hover:border-cobalt/20 hover:shadow-sm transition-all duration-200 flex flex-col gap-5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.value}
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
