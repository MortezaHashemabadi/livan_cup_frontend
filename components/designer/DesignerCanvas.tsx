"use client";
import { Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  generatedImage: string | null;
  isGenerating: boolean;
}

export default function DesignerCanvas({
  generatedImage,
  isGenerating,
}: Props) {
  return (
    <div className="w-full max-w-full relative rounded-[40px] bg-white border border-border/50 overflow-hidden aspect-square flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-soft-blue/40 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
            </div>
            <p className="font-heading font-semibold mb-1">
              در حال ساختن طرح شما...
            </p>
            <p className="text-sm text-muted-foreground">
              هوش مصنوعی الگوی سفارشی را تولید می‌کند
            </p>
          </motion.div>
        ) : generatedImage ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-8 flex items-center justify-center"
          >
            <img
              src={generatedImage}
              alt="طرح تولید شده"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-12"
          >
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mx-auto mb-5">
              <Wand2 className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="font-heading font-semibold mb-1 text-muted-foreground/60">
              طرح شما اینجا نمایش داده می‌شود
            </p>
            <p className="text-sm text-muted-foreground/40">
              یک پرامپت وارد کنید یا یک سبک آماده انتخاب کنید
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
