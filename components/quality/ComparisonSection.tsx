"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ComparisonRow {
  label: string;
  ordinary: boolean;
  ours: boolean;
}

const cupRows: ComparisonRow[] = [
  { label: "تولید با چسب", ordinary: false, ours: true },
  { label: "کیفیت کاغذ", ordinary: false, ours: true },
  { label: "مقاومت در برابر نشتی", ordinary: false, ours: true },
  { label: "کیفیت چاپ", ordinary: false, ours: true },
  { label: "کیفیت مواد اولیه", ordinary: false, ours: true },
];

const bagRows: ComparisonRow[] = [
  { label: "پارچه باکیفیت", ordinary: false, ours: true },
  { label: "چاپ اختصاصی برند", ordinary: false, ours: true },
  { label: "دوخت دقیق", ordinary: false, ours: true },
  { label: "تنوع ابعاد و مدل", ordinary: false, ours: true },
  { label: "کیفیت مواد اولیه", ordinary: false, ours: true },
];

function ComparisonTable({
  title,
  rows,
}: {
  title: string;
  rows: ComparisonRow[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border border-border/50 overflow-hidden"
    >
      <div className="grid grid-cols-3 bg-secondary/50 px-6 py-4">
        <span className="text-sm font-semibold text-muted-foreground">
          ویژگی
        </span>
        <span className="text-sm font-semibold text-muted-foreground text-center">
          معمولی
        </span>
        <span className="text-sm font-semibold text-cobalt text-center">
          لیوان کاپس
        </span>
      </div>

      <div className="px-6 py-5 border-b border-border/40">
        <h3 className="font-heading font-bold text-lg">{title}</h3>
      </div>

      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-3 items-center px-6 py-4 ${
            i !== rows.length - 1 ? "border-b border-border/40" : ""
          }`}
        >
          <span className="text-sm font-medium">{row.label}</span>

          <div className="flex justify-center">
            {row.ordinary ? (
              <div className="w-6 h-6 rounded-full bg-cobalt/10 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-cobalt" />
              </div>
            ) : (
              <X className="w-5 h-5 text-destructive/60" />
            )}
          </div>

          <div className="flex justify-center">
            {row.ours ? (
              <div className="w-6 h-6 rounded-full bg-cobalt/10 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-cobalt" />
              </div>
            ) : (
              <X className="w-5 h-5 text-destructive/60" />
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            مقایسه محصولات
          </span>

          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            کیفیتی که در جزئیات دیده می‌شود
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ComparisonTable title="لیوان بیرون‌بر" rows={cupRows} />

          <ComparisonTable title="بگ پارچه‌ای" rows={bagRows} />
        </div>
      </div>
    </section>
  );
}
