"use client";
import { useRef } from "react";
import { Upload, X, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  brandName: string;
  onBrandNameChange: (v: string) => void;
  logoFile: File | null;
  logoPreview: string | null;
  onLogoSelect: (file: File) => void;
  onLogoClear: () => void;
}

export default function DesignerBrandPanel({
  brandName,
  onBrandNameChange,
  logoFile,
  logoPreview,
  onLogoSelect,
  onLogoClear,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-3xl p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium">اطلاعات برند (اختیاری)</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            نام برند
          </label>
          <Input
            value={brandName}
            onChange={(e) => onBrandNameChange(e.target.value)}
            placeholder="مثلاً: کافه باران"
            className="rounded-2xl h-10 bg-secondary/50 border-0 focus-visible:ring-cobalt text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            لوگو (به عنوان مرجع سبک)
          </label>
          {logoPreview ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="لوگو"
                  className="h-14 w-14 rounded-xl object-contain border border-border/40 bg-secondary/30 p-1"
                />
                <button
                  onClick={onLogoClear}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-xs font-medium">{logoFile?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  لوگو به عنوان مرجع سبک استفاده می‌شود
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-border/50 hover:border-cobalt/40 bg-secondary/30 hover:bg-secondary/50 transition-all text-sm text-muted-foreground"
            >
              <Upload className="w-4 h-4 flex-shrink-0" />
              آپلود لوگو
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onLogoSelect(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
