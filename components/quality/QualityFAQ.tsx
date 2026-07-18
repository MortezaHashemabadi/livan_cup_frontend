"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// تعریف اینترفیس برای ساختار داده‌های سؤالات متداول
interface FAQItemType {
  question: string;
  answer: string;
}

const faqs: FAQItemType[] = [
  {
    question: "چرا از چسب استفاده نمی‌کنید؟",
    answer:
      "ما از اتصال حرارتی برای فرم‌دهی لیوان استفاده می‌کنیم که ایمن‌تر، پایدارتر و بدون مواد شیمیایی اضافه است.",
  },
  {
    question: "چه نوع کاغذی استفاده می‌شود؟",
    answer:
      "کاغذ وارداتی آلمانی با گراماژ بالا که استحکام و ظاهری ممتاز به محصول می‌دهد.",
  },
  {
    question: "آیا کاغذ ایمن برای مواد غذایی است؟",
    answer:
      "بله، تمامی مواد اولیه دارای تأییدیه درجه غذایی و ایمن برای تماس مستقیم با نوشیدنی هستند.",
  },
  {
    question: "از چه فناوری چاپی استفاده می‌شود؟",
    answer:
      "چاپ دیجیتال با وضوح بالا که رنگ‌ها را پایدار و طرح‌ها را دقیق روی سطح لیوان نمایش می‌دهد.",
  },
];

// تعریف اینترفیس برای پراپ‌های کامپوننت FAQItem
interface FAQItemProps {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${isOpen ? "border-cobalt/20 bg-white" : "border-border bg-white hover:border-cobalt/20"}`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-heading font-semibold text-base leading-snug text-right">
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isOpen ? "bg-cobalt text-white" : "bg-secondary text-foreground"}`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm text-right">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QualityFAQ() {
  // تایپ‌دهی صریح به useState
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // تایپ‌دهی به ورودی تابع toggle
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            سؤالات متداول
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            سؤالات درباره کیفیت تولید
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <FAQItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
