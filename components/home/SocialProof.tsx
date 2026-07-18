"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "۵۰۰+", label: "برند خدمت‌گرفته" },
  { value: "۲ میلیون+", label: "لیوان تولیدشده" },
  { value: "۵۰+", label: "کشور" },
  { value: "۹۹٪", label: "رضایت مشتریان" },
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-muted-foreground/60 tracking-widest uppercase mb-12"
        >
          مورد اعتماد کافه‌ها، رستوران‌ها و برندهای سراسر جهان
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
