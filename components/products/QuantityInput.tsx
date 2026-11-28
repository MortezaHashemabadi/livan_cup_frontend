"use client";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toLatinDigits } from "@/lib/utils";

interface Props {
  value: number;
  /** حداقل مقدار مجاز (مثلاً حداقل تیراژ سفارش) */
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

// عدد قابل‌تایپ (فارسی یا انگلیسی) + دکمه‌های کم/زیاد؛ مقدار هیچ‌وقت زیر min نمی‌رود.
export default function QuantityInput({
  value,
  min = 1,
  step = 1,
  onChange,
  size = "md",
}: Props) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (raw: string) => {
    const parsed = parseInt(toLatinDigits(raw).replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = Math.max(min, parsed);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const small = size === "sm";
  const buttonClass = small
    ? "w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
    : "w-9 h-9 rounded-full hover:bg-background transition-colors flex items-center justify-center disabled:opacity-40";

  return (
    <div
      className={`flex items-center ${
        small ? "gap-2" : "gap-2 bg-secondary rounded-full p-1"
      }`}
    >
      <button
        type="button"
        onClick={() => commit(String(value - step))}
        disabled={value <= min}
        aria-label="کم کردن"
        className={buttonClass}
      >
        <Minus className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commit(draft)}
        aria-label="تعداد"
        className={`bg-transparent text-center font-medium outline-none tabular-nums ${
          small ? "text-sm w-16" : "text-sm w-20"
        }`}
      />
      <button
        type="button"
        onClick={() => commit(String(value + step))}
        aria-label="زیاد کردن"
        className={buttonClass}
      >
        <Plus className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>
    </div>
  );
}
