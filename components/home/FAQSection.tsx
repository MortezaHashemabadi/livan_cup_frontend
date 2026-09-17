"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "چه محصولاتی می‌توانم به‌صورت اختصاصی سفارش دهم؟",
    answer:
      "در حال حاضر می‌توانید لیوان بیرون‌بر و بگ پارچه‌ای را با طراحی اختصاصی برند خود سفارش دهید.",
  },
  {
    question: "حداقل تعداد سفارش برای لیوان سفارشی چقدر است؟",
    answer:
      "حداقل سفارش ما از ۱۰۰ عدد شروع می‌شود که برای کافه‌های کوچک، رویدادها و پاپ‌آپ‌ها مناسب است. برای سفارش‌های بیش از ۵۰۰ عدد، تخفیف حجمی دریافت می‌کنید.",
  },
  {
    question: "آیا می‌توانم طرح و لوگوی خودم را برای تولید ارسال کنم؟",
    answer:
      "بله. می‌توانید لوگو یا طرح آماده برندتان را ارسال کنید تا برای تولید روی محصول آماده‌سازی شود.",
  },
  {
    question: "آیا امکان طراحی اختصاصی برای سفارش وجود دارد؟",
    answer:
      "بله. اگر طرح آماده ندارید، می‌توانید ایده و سبک موردنظرتان را با ما در میان بگذارید تا طرح مناسب محصول شما آماده شود.",
  },
  {
    question: "ابزار طراحی هوش مصنوعی چطور کار می‌کند؟",
    answer:
      "کافی است برند، سبک یا ایده‌تان را در یک متن کوتاه توضیح دهید — هوش مصنوعی ما در چند ثانیه طرح آماده چاپ می‌سازد.",
  },
  {
    question: "لیوان‌های بیرون‌بر چه ویژگی‌هایی دارند؟",
    answer:
      "لیوان‌ها با تکنولوژی اولتراسونیک و بدون استفاده از چسب تولید می‌شوند و برای استفاده با نوشیدنی‌های گرم طراحی شده‌اند.",
  },
  {
    question: "بگ‌های پارچه‌ای در چه مدل‌هایی قابل سفارش هستند؟",
    answer:
      "بگ‌های پارچه‌ای در مدل‌ها و ابعاد مختلف قابل تولید هستند و می‌توان طراحی و چاپ آن‌ها را متناسب با هویت بصری برند انجام داد.",
  },
  {
    question: "زمان آماده‌سازی سفارش چقدر است؟",
    answer:
      "زمان تولید با توجه به نوع محصول، تعداد سفارش و مشخصات چاپ متفاوت است. زمان دقیق پس از بررسی سفارش و تأیید نهایی اعلام می‌شود.",
  },
  {
    question: "آیا قبل از تولید امکان تأیید طرح وجود دارد؟",
    answer:
      "بله. طرح سفارش پیش از ورود به مرحله تولید بررسی و تأیید می‌شود تا محصول نهایی مطابق مشخصات موردنظر شما تولید شود.",
  },
  {
    question: "آیا می‌توانم قبل از سفارش انبوه، نمونه فیزیکی ببینم؟",
    answer:
      "بله — پک نمونه با هزینه‌ی ثابت ارائه می‌شود که از اولین سفارش انبوه کسر می‌گردد.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
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
            <Minus className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
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
            transition={{ duration: 0.25 }}
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            پرسش‌های رایج
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            همه چیزی که درباره سفارش، طراحی و ارسال لیوان‌ها و بگ های سفارشی باید
            بدانید.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
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