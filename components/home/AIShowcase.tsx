"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const designs = [
  {
    id: 1,
    name: "اسکاندیناوی مینیمال",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/df9782f62_generated_ae760354.png",
    color: "bg-soft-blue/20",
  },
  {
    id: 2,
    name: "باغ گیاهی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/8825e30b7_generated_d6d3c25a.png",
    color: "bg-pale-mint/30",
  },
  {
    id: 3,
    name: "نسخه لوکس",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/98e1fafbd_generated_4cff30a3.png",
    color: "bg-soft-peach/20",
  },
  {
    id: 4,
    name: "ذن ژاپنی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/30c1cec38_generated_c8cfc160.png",
    color: "bg-soft-blue/20",
  },
  {
    id: 5,
    name: "هنر انتزاعی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/485eade45_generated_c7f34772.png",
    color: "bg-soft-peach/20",
  },
  {
    id: 6,
    name: "قهوه‌خانه قدیمی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/072b53e63_generated_e4ada157.png",
    color: "bg-cream",
  },
];

export default function AIShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-32 bg-[#F3F7F9] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-soft-blue/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cobalt/10 text-cobalt text-sm font-medium mb-6">
              <Wand2 className="w-4 h-4" />
              موتور طراحی هوش مصنوعی
            </div>

            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.2] tracking-tight mb-6">
              توصیف کن.
              <br />
              <span className="text-cobalt">هوش مصنوعی می‌سازد.</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
              فقط ایده‌ات را بگو — رنگ، الگو، حس و حال — هوش مصنوعی ما در چند
              ثانیه طرح آماده تولید می‌سازد.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "پرامپت ← تولید هوش مصنوعی ← پیش‌نمایش ← سفارش",
                "تنوع نامحدود سبک",
                "خروجی آماده چاپ",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cobalt/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-cobalt" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>

            <Link href="/designer">
              <Button className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-12 px-8 font-medium shadow-none">
                طراح هوش مصنوعی را امتحان کن
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 rounded-[40px] ${designs[active].color} p-8 flex items-center justify-center`}
                >
                  <img
                    src={designs[active].image}
                    alt={designs[active].name}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-6 gap-2 mt-6">
              {designs.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setActive(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    i === active
                      ? "border-cobalt scale-105 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
