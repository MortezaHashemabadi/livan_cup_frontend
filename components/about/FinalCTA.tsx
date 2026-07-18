"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] bg-foreground overflow-hidden p-16 md:p-24 text-center"
        >
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-cobalt/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-soft-peach/10 blur-3xl" />

          <div className="relative">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-background tracking-tight mb-6">
              آماده ثبت سفارش هستید؟
            </h2>

            <p className="text-background/50 text-lg max-w-md mx-auto mb-10">
              همین حالا سفارش سفارشی خود را شروع کنید — از انتخاب محصول تا طراحی
              اختصاصی.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-10 font-medium text-base border-background/20 text-background hover:bg-background/10 hover:text-background"
                >
                  مشاهده محصولات
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>

              <Link href="/designer">
                <Button
                  size="lg"
                  className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-14 px-10 font-medium text-base shadow-none"
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  شروع طراحی
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
