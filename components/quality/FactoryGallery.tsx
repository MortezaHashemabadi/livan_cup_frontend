"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// تعریف اینترفیس برای تایپ‌اسکریپت (className اختیاری است)
interface GalleryImage {
  label: string;
  url: string;
  className?: string;
}

const images: GalleryImage[] = [
  {
    label: "کارخانه",
    url: "/quality/images.jpg",
    className: "row-span-2",
  },
  {
    label: "ماشین‌آلات",
    url: "/quality/ChatGPT_mashine.png",
  },
  {
    label: "خط تولید",
    url: "/quality/ChatGPT_product_line.png",
  },
  {
    label: "بازرسی کیفیت",
    url: "/quality/Gemini_Generated_Image_s90pzus90pzus90p.png",
  },
  {
    label: "بسته‌بندی",
    url: "/quality/Gemini_Generated_Image_tcoslgtcoslgtcos.png",
    className: "row-span-2",
  },
  {
    label: "انبار",
    url: "/quality/Gemini_Generated_Image_7z1kwx7z1kwx7z1k.png",
    className: "col-span-2",
  },
];

export default function FactoryGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            نگاهی به کارخانه
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight">
            گالری تولید
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[180px]">
          {images.map((img, i) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`relative rounded-3xl overflow-hidden group ${img.className || ""}`}
            >
              {/* جایگزینی img با Image اختصاصی Next.js */}
              <Image
                src={img.url}
                alt={img.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
              <span className="absolute bottom-4 right-4 text-white text-sm font-semibold z-20">
                {img.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
