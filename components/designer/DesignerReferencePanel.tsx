"use client";
import { useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface Props {
  referenceFiles: File[];
  referencePreviews: string[];
  onAdd: (file: File) => void;
  onRemove: (i: number) => void;
}

export default function DesignerReferencePanel({
  referenceFiles,
  referencePreviews,
  onAdd,
  onRemove,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-3xl p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium">تصاویر مرجع (اختیاری)</p>
        <span className="text-xs text-muted-foreground">
          (طرح‌هایی که می‌خوای شبیهشون باشه)
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {referencePreviews.map((preview, i) => (
          <div key={i} className="relative group">
            <img
              src={preview}
              alt=""
              className="h-16 w-16 rounded-xl object-cover border border-border/30"
            />
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {referencePreviews.length < 3 && (
          <button
            onClick={() => fileRef.current?.click()}
            className="h-16 w-16 rounded-xl border-2 border-dashed border-border/50 hover:border-cobalt/40 bg-secondary/30 flex items-center justify-center transition-all"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onAdd(f);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-muted-foreground/60 mt-2">
        حداکثر ۳ تصویر مرجع
      </p>
    </div>
  );
}
