"use client";

import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

// تعریف اینترفیس برای تایپ‌اسکریپت
interface StandardItem {
  code: string;
  name: string;
}

const standards: StandardItem[] = [
  { code: "ISO", name: "ایزو ۹۰۰۱" },
  { code: "HACCP", name: "استاندارد ایمنی غذایی" },
  { code: "FDA", name: "تأییدیه مواد غذایی" },
  { code: "FGS", name: "استاندارد درجه غذایی" },
];

export default function QualityStandards() {
  return (
    <section className="py-24 bg-[#F5F9F4]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            استانداردهای کیفیت
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            گواهی‌نامه‌ها و استانداردها
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {standards.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-3xl border border-border/50 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-pale-mint flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-6 h-6 text-cobalt" />
              </div>
              <p className="font-display font-extrabold text-lg mb-1">
                {s.code}
              </p>
              <p className="text-xs text-muted-foreground">{s.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
