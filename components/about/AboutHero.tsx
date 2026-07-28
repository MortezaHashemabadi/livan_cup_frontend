"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export default function AboutHero() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
              درباره کاپ‌کرافت
            </span>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-[1.2]">
              تولیدی که با
              <br />
              <span className="text-cobalt">اعتماد شما</span> رشد کرده
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mb-4">
              کاپ‌کرافت تولیدکننده لیوان‌های کاغذی و پلاستیکی سفارشی است که
              کیفیت صنعتی را با طراحی هوشمند ترکیب می‌کند.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed max-w-lg mb-10">
              از کافه‌های کوچک تا زنجیره‌های بزرگ رستورانی، همراه کسب‌وکار شما
              هستیم — از اولین طرح تا تحویل نهایی.
            </p>

            <Link href="/products">
              <Button
                size="lg"
                className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-14 px-10 font-medium text-base shadow-none"
              >
                مشاهده محصولات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="relative aspect-[4/3] rounded-[40px] overflow-hidden bg-cream"
          >
            <Image
              src="/about/chatgpt_about_hero.png"
              alt="خط تولید کاپ‌کرافت"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
