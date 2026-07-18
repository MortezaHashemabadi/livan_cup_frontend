"use client";

import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Factory, Truck } from "lucide-react";

type Step = {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
};

const steps: Step[] = [
  {
    icon: ClipboardList,
    title: "ثبت سفارش",
    desc: "مشخصات و تعداد مورد نیاز خود را ثبت کنید.",
    color: "bg-soft-peach",
  },
  {
    icon: CheckCircle2,
    title: "تایید سفارش",
    desc: "تیم ما جزئیات را بررسی و سفارش را تایید می‌کند.",
    color: "bg-soft-blue",
  },
  {
    icon: Factory,
    title: "تولید",
    desc: "محصول شما وارد خط تولید اختصاصی می‌شود.",
    color: "bg-pale-mint",
  },
  {
    icon: Truck,
    title: "تحویل",
    desc: "سفارش بسته‌بندی و به آدرس شما ارسال می‌شود.",
    color: "bg-cream",
  },
];

export default function OrderingProcess() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            فرآیند سفارش
          </h2>

          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            از ثبت سفارش تا درب منزل، در چهار گام ساده
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-foreground/70" />
                </div>

                <div className="text-xs font-mono text-muted-foreground/40 mb-3">
                  ۰{i + 1}
                </div>

                <h3 className="font-heading font-bold text-lg mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
