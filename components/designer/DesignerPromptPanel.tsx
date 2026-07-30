"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Sparkles,
  RefreshCw,
  Loader2,
  Check,
  Paperclip,
  X,
  Save,
} from "lucide-react";
import {
  stylePresets,
  colorPalettes,
  promptSuggestions,
} from "@/lib/designer-data";

interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
}
interface AutoPart {
  fa: string;
  en: string;
}

interface Props {
  prompt: string;
  onPromptChange: (v: string) => void;
  autoPromptParts: Record<string, AutoPart>;
  selectedPreset: string | null;
  onPreset: (preset: (typeof stylePresets)[number]) => void;
  onPalette: (palette: (typeof colorPalettes)[number]) => void;
  onSuggestion: (text: string) => void;
  uploadedFile: File | null;
  uploadedPreview: string | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  generatedImage: string | null;
  isGenerating: boolean;
  quota: QuotaInfo | null;
  designName: string;
  onDesignNameChange: (v: string) => void;
  isSaving: boolean;
  onGenerate: () => void;
  onSave: () => void;
}

export default function DesignerPromptPanel({
  prompt,
  onPromptChange,
  autoPromptParts,
  selectedPreset,
  onPreset,
  onPalette,
  onSuggestion,
  uploadedFile,
  uploadedPreview,
  onFileSelect,
  onFileClear,
  generatedImage,
  isGenerating,
  quota,
  designName,
  onDesignNameChange,
  isSaving,
  onGenerate,
  onSave,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="bg-white rounded-3xl p-6 border border-border/50 flex flex-col w-full max-w-full min-w-0 overflow-hidden">
        <label className="text-sm font-medium mb-4 block">سبک‌های آماده</label>

        {/* این wrapper اضافی باعث قفل شدن کامل عرض می‌شود */}
        <div className="w-full max-w-full min-w-0 overflow-hidden">
          <Carousel
            dir="ltr"
            className="w-full max-w-full min-w-0"
            opts={{ containScroll: "keepSnaps", direction: "ltr" }}
          >
            <CarouselContent className="-ms-2 py-2">
              {stylePresets.map((preset) => (
                <CarouselItem
                  key={preset.id}
                  /* min-w-0 و shrink-0 مانع از کش آمدن آیتم‌ها می‌شوند */
                  className="basis-1/2 ps-2 lg:basis-1/3 min-w-0 shrink-0 grow-0"
                >
                  <button
                    type="button"
                    onClick={() => onPreset(preset)}
                    className={`relative w-full rounded-2xl overflow-hidden group transition-all duration-200 ${
                      selectedPreset === preset.id
                        ? "ring-2 ring-cobalt"
                        : "ring-1 ring-border/40 hover:ring-cobalt/40"
                    }`}
                  >
                    {/* bg-slate-100 یا bg-muted مانع از Layout Shift قبل از لود عکس می‌شود */}
                    <div className="aspect-square w-full relative overflow-hidden bg-slate-100">
                      <img
                        src={preset.image}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-background text-xs font-semibold truncate">
                        {preset.name}
                      </p>
                    </div>
                    {selectedPreset === preset.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cobalt flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-border/50">
        <p className="text-sm font-medium mb-3">پالت رنگی</p>
        <div className="flex flex-wrap gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.name}
              onClick={() => onPalette(palette)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border/40 hover:border-cobalt/30 transition-colors"
            >
              <div className="flex gap-1">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-border/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-border/50">
        <label className="text-sm font-medium mb-3 block">پرامپت طراحی</label>

        {uploadedPreview && (
          <div className="relative mb-2 inline-block">
            <img
              src={uploadedPreview}
              alt="فایل آپلودشده"
              className="h-16 w-16 rounded-xl object-cover border border-border/40"
            />
            <button
              onClick={onFileClear}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {Object.values(autoPromptParts).some(Boolean) && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-cobalt/5 border border-cobalt/10 text-xs text-cobalt/70 leading-relaxed">
            <span className="font-medium text-cobalt">خودکار: </span>
            {Object.values(autoPromptParts)
              .map((p) => p.fa)
              .filter(Boolean)
              .join("، ")}
          </div>
        )}

        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="یک لیوان قهوه مینیمالیست با رنگ‌های بژ ملایم..."
            className="min-h-[100px] border-0 bg-secondary/50 rounded-2xl resize-none text-sm focus-visible:ring-cobalt pl-10"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 left-3 p-1.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="آپلود تصویر مرجع"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileSelect(f);
            }}
          />
        </div>

        {uploadedFile && (
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            {uploadedFile.name}
          </p>
        )}

        {quota !== null && (
          <div
            className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl mt-3 ${
              quota.remaining === 0
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary/60 text-muted-foreground"
            }`}
          >
            <span>طرح‌های باقی‌مانده این ماه</span>
            <span className="font-bold">
              {quota.remaining} از {quota.limit}
            </span>
          </div>
        )}

        {!generatedImage ? (
          <Button
            onClick={onGenerate}
            disabled={
              isGenerating ||
              (!prompt.trim() && !Object.values(autoPromptParts).some(Boolean))
            }
            className="w-full mt-3 bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-11 font-medium shadow-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال تولید...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 ml-2" />
                تولید طرح
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3 mt-3">
            <div className="flex gap-2">
              <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex-1 bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-11 font-medium shadow-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    در حال تولید...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 ml-2" />
                    تولید طرح جدید
                  </>
                )}
              </Button>
              <Button
                onClick={onGenerate}
                disabled={isGenerating}
                variant="outline"
                className="rounded-full h-11 px-4"
                title="بهبود طرح"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 pt-1 border-t border-border/30">
              <Input
                value={designName}
                onChange={(e) => onDesignNameChange(e.target.value)}
                placeholder="نام طرح..."
                onKeyDown={(e) => e.key === "Enter" && onSave()}
                className="rounded-2xl h-10 text-sm bg-secondary/50 border-0 focus-visible:ring-cobalt"
              />
              <Button
                onClick={onSave}
                disabled={isSaving || !designName.trim()}
                size="sm"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-4 shadow-none flex-shrink-0"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 ml-1" />
                    ذخیره
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
