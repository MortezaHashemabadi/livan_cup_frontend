"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Factory } from "lucide-react";
import { motion } from "framer-motion";

export default function QualityHero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden min-h-[70vh] flex items-center justify-center">
      {/* ۱. ویدیوی پس‌زمینه */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        {/* آدرس ویدیو خود را در قسمت src قرار دهید (مثلاً در پوشه public) */}
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ۲. لایه فیلتر (Overlay) جهت تیره کردن و خوانایی متن‌ها */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[2px] z-10" />

      {/* ۳. دایره‌های رنگی پس‌زمینه (اختیاری - در صورت تمایل می‌توانید نگه دارید یا حذف کنید) */}
      <div className="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full bg-soft-blue/20 blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] rounded-full bg-pale-mint/20 blur-3xl z-10 pointer-events-none" />

      {/* محتوای اصلی با z-20 برای قرار گرفتن روی لایه فیلتر */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20"
        >
          <Factory className="w-7 h-7 text-white" />
        </motion.div>

        {/* تغییر رنگ متن به سفید برای خوانایی بهتر */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-extrabold text-4xl md:text-6xl tracking-tight mb-6 text-white"
        >
          کیفیت تولید ما
        </motion.h1>

        {/* تغییر رنگ متن توضیحات به سفید مات */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          محصولات ما در دلی جدا از سایرین ساخته می‌شوند؛ از انتخاب مواد اولیه تا
          بسته‌بندی نهایی، هر مرحله با دقت و استانداردهای بالا کنترل می‌شود.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/products">
            <Button
              size="lg"
              className="bg-white text-cobalt hover:bg-white/90 rounded-full h-14 px-10 font-medium text-base shadow-lg transition-all"
            >
              مشاهده محصولات
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
