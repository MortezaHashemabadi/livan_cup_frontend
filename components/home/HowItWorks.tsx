"use client";
import { motion } from "framer-motion";
import {
  CupSoda,
  MessageSquareText,
  Sparkles,
  Users,
  FileImage,
  Truck,
} from "lucide-react";

const steps = [
  {
    title: "محصول خود را انتخاب کنید",
    desc: "اندازه، جنس و ساختار مناسب را از کاتالوگ ما انتخاب کنید.",
    color: "bg-soft-peach",
    icon: CupSoda,
  },
  {
    title: "طرح خود را توصیف کنید",
    desc: "به هوش مصنوعی یا کارشناسان ما بگویید چه می‌خواهید — رنگ، الگو و حس کلی.",
    color: "bg-soft-blue",
    icon: MessageSquareText,
  },
  {
    color: "bg-pale-mint",
    options: [
      { icon: Sparkles, label: "هوش مصنوعی", desc: "در چند ثانیه طرح بساز." },
      { icon: Users, label: "کارشناسان ما", desc: "تیم ما برات طرح می‌زنه." },
      { icon: FileImage, label: "طرح آماده", desc: "فایل خودتو آپلود کن." },
    ],
  },
  {
    title: "سفارش تولید دهید",
    desc: "طرح نهایی را تأیید کنید و مستقیم به خط تولید بفرستید.",
    color: "bg-cream",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            چطور کار می‌کند؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            از ایده تا تولید در چهار مرحله ساده
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 items-center">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center group flex flex-col items-center justify-center h-full"
            >
              {step.options ? (
                <div className="flex flex-col items-center gap-10">
                  {step.options.map((opt, j) => (
                    <div key={j} className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 ${step.color} rounded-3xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <opt.icon className="w-7 h-7 text-foreground/70" />
                      </div>
                      <p className="text-xs font-bold mb-1">{opt.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[8rem]">
                        {opt.desc}
                      </p>
                    </div>
                  ))}
                  <div className="text-xs font-mono text-muted-foreground/40">
                    ۰3
                  </div>
                  <h3 className="font-heading font-bold text-lg -mt-2">
                    {step.title}
                  </h3>
                </div>
              ) : (
                <>
                  <div
                    className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8 text-foreground/70" />
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
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
