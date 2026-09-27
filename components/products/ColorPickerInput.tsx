"use client";

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// اینپوت متنی آزاد (اسم رنگ یا هگز) + یه دایره‌ی رنگ که چرخ رنگ واقعی مرورگر رو باز می‌کند.
// انتخاب از چرخ رنگ، کد هگز رو توی اینپوت می‌ذارد؛ کاربر همچنان می‌تواند آزاد هم تایپ کند.
export default function ColorPickerInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const isHex = HEX_PATTERN.test(value.trim());

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm"
      />
      <input
        type="color"
        value={isHex ? value : "#cccccc"}
        onChange={(e) => onChange(e.target.value)}
        aria-label="انتخاب رنگ"
        className="w-9 h-9 shrink-0 rounded-full border border-border cursor-pointer p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
      />
    </div>
  );
}
