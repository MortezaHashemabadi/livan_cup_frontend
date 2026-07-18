"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package2,
  Scissors,
  CircleDot,
  ScanSearch,
  Box,
  Truck,
  LucideIcon,
} from "lucide-react";

// تعریف اینترفیس برای مراحل تولید
interface StepItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: StepItem[] = [
  {
    icon: Package2,
    title: "مواد اولیه",
    desc: "انتخاب کاغذ و مواد درجه غذایی با کیفیت تضمین‌شده.",
  },
  {
    icon: Scissors,
    title: "برش کاغذ",
    desc: "برش دقیق کاغذ مطابق با اندازه و طرح نهایی.",
  },
  {
    icon: CircleDot,
    title: "فرم‌دهی لیوان",
    desc: "شکل‌دهی و اتصال حرارتی بدون چسب.",
  },
  {
    icon: ScanSearch,
    title: "بازرسی کیفیت",
    desc: "کنترل کیفیت هر محصول پیش از بسته‌بندی.",
  },
  {
    icon: Box,
    title: "بسته‌بندی",
    desc: "بسته‌بندی ایمن و مرتب برای حمل و نقل.",
  },
  { icon: Truck, title: "ارسال", desc: "تحویل به‌موقع به دست مشتریان." },
];

export default function ProductionProcess() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            فرآیند تولید
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            از مواد اولیه تا تحویل
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative bg-white rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-cobalt text-white flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/50">
                  مرحله {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-base mb-1.5">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
