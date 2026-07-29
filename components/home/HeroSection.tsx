"use client";
import Link from "next/link";
import { Sparkles, ArrowLeft, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const metrics = [
  { value: "10 هزار+", label: "لیوان روزانه" },
  { value: "72 ساعت", label: "میانگین تولید" },
  { value: "100٪", label: "گواهی ایمنی غذایی" },
  { value: "500+", label: "برند مشتری" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 80% 10%, var(--soft-blue) 0%, transparent 55%),
                     radial-gradient(90% 80% at 10% 90%, var(--soft-peach) 0%, transparent 55%),
                     linear-gradient(180deg, var(--cream) 0%, #ffffff 100%)`,
            }}
          />
          <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-soft-peach/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pale-mint/20 blur-[100px] pointer-events-none" />
    
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full pt-10 pb-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-20 items-center">
              {/* عکس - حالا در موبایل هم نمایش داده می‌شود، قبل از متن */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative order-1 lg:order-2 -mx-2 sm:mx-0"
              >
                <div className="relative rounded-[24px] lg:rounded-[40px] overflow-hidden bg-gradient-to-bl from-soft-peach/60 via-cream to-soft-blue/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] lg:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.12)] aspect-square flex items-center justify-center">
                  <Image
                    src="/hero_image_new.png"
                    alt="لیوان کاغذی سفارشی"
                    width={600}
                    height={600}
                    className="w-[100%] h-auto object-contain drop-shadow-2xl"
                    priority
                  />
    
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="absolute top-4 left-4 lg:top-7 lg:left-7 flex items-center gap-1.5 lg:gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 lg:px-4 lg:py-2.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.10)] border border-white"
                  >
                    <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-cobalt" />
                    <span className="text-[11px] lg:text-xs font-semibold text-foreground">
                      اسکاندیناوی مینیمال
                    </span>
                  </motion.div>
    
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="hidden sm:flex absolute top-7 right-7 items-center gap-2 bg-cobalt/90 backdrop-blur-md rounded-full px-4 py-2.5 shadow-[0_4px_20px_-2px_rgba(26,102,204,0.25)]"
                  >
                    <Leaf className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">
                      گواهی زیست‌محیطی
                    </span>
                  </motion.div>
                </div>
    
                <div className="absolute inset-0 rounded-[24px] lg:rounded-[40px] ring-1 ring-border/40 pointer-events-none" />
              </motion.div>
    
              {/* متن */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-soft-blue/50 border border-cobalt/10 text-cobalt text-xs font-semibold tracking-wide mb-8">
                  <Sparkles className="w-3.5 h-3.5" />
                  طراحی لیوان با هوش مصنوعی
                </div>
    
                <h1 className="font-display font-extrabold text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[1.2] tracking-tight text-foreground mb-6">
                  لیوان سفارشی،
                  <br />
                  <span className="text-cobalt">طراحی شده با هوش مصنوعی.</span>
                </h1>
    
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-10">
                  در چند دقیقه لیوان برند خود را بسازید. با هوش مصنوعی طرح، رنگ و
                  گرافیک تولید کنید — سپس سفارش آماده برای چاپ بدهید.
                </p>
    
                <div className="flex items-center gap-4 mb-12">
                  <Link href="/designer">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-12 px-7 font-semibold text-sm shadow-none">
                      شروع طراحی
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                    </Button>
                  </Link>
                  <Link
                    href="/products"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
    
                <div className="flex items-center gap-6 sm:gap-8 pt-8 border-t border-border/60 overflow-hidden">
                  {metrics.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                      className="shrink-0"
                    >
                      <p className="font-display font-extrabold text-xl text-foreground">
                        {m.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                        {m.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
  );
}
