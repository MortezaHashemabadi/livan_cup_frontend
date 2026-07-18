"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-border/50 p-6 flex items-start gap-4"
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-extrabold leading-none mb-1">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
