"use client";
import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useProducts } from "@/lib/hooks/use-catalog";
import {
  getAttributeGroups,
  findVariant,
  getUnitPrice,
  getVariantImage,
} from "@/lib/api/endpoints/catalog";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import { useSaveDesign } from "@/lib/hooks/use-designs";
import { aiApi, type GenerateAiPayload } from "@/lib/api/endpoints/designs";
import { galleryApi } from "@/lib/api/endpoints/gallery";
import {
  attributePromptMap,
  stylePresets,
  colorPalettes,
} from "@/lib/designer-data";
import DesignerCanvas from "@/components/designer/DesignerCanvas";
import DesignerPromptPanel from "@/components/designer/DesignerPromptPanel";
import { buildFinalPrompt } from "@/lib/designer-data";
import DesignerBrandPanel from "@/components/designer/DesignerBrandPanel";
import DesignerReferencePanel from "@/components/designer/DesignerReferencePanel";

type AutoPart = { fa: string; en: string };

export default function DesignerPage() {
  const { data: products = [], isLoading } = useProducts();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const saveDesign = useSaveDesign();

  const designableProducts = useMemo(
    () =>
      products.filter(
        (p) => p.is_designable && p.variants.some((v) => v.is_designable),
      ),
    [products],
  );

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [autoPromptParts, setAutoPromptParts] = useState<
    Record<string, AutoPart>
  >({});
  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [designName, setDesignName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [quota, setQuota] = useState<{
    used: number;
    limit: number;
    remaining: number;
  } | null>(null);

  const product =
    designableProducts.find((p) => p.id === selectedProductId) || null;
  const designableVariants = product
    ? product.variants.filter((v) => v.is_designable)
    : [];
  const designableProduct = product
    ? { ...product, variants: designableVariants }
    : null;
  const attributeGroups = designableProduct
    ? getAttributeGroups(designableProduct)
    : [];

  useEffect(() => {
    if (designableProducts.length > 0 && selectedProductId === null)
      setSelectedProductId(designableProducts[0].id);
  }, [designableProducts]);

  useEffect(() => {
    if (!designableVariants.length) return;
    const first =
      designableVariants.find((v) => v.stock_status === "in_stock") ||
      designableVariants[0];
    const initial: Record<string, string> = {};
    const autoParts: Record<string, AutoPart> = {};
    first.attribute_values.forEach((av) => {
      initial[av.attribute_slug] = av.value;
      const t = attributePromptMap[av.attribute_slug]?.[av.value];
      if (t) autoParts[av.attribute_slug] = t;
    });
    setSelected(initial);
    setAutoPromptParts(autoParts);
  }, [product]);

  useEffect(() => {
    if (!isAuthenticated) return;
    aiApi
      .quotaStatus()
      .then(setQuota)
      .catch(() => {});
  }, [isAuthenticated]);

  const generateAiMutation = useMutation({
    mutationFn: (data: GenerateAiPayload) => aiApi.generateImage(data),
    onSuccess: (res) => {
      setGeneratedImage(res.url);
      setQuota(res.quota);
      toast.success("طرح آماده شد!");
    },
    onError: (err: any) => {
      const s = err?.status;
      if (s === 429)
        toast.error("سقف ماهانه تمام شد 😔", {
          description: "ماه آینده دوباره فعال می‌شود.",
          duration: 6000,
        });
      else if (s === 401) openAuthModal();
      else if (err?.message?.includes("پاسخ نداد") || s === 502)
        toast.error("سرور طراحی پرمشغله 🎨", {
          description: "چند لحظه صبر کنید.",
          duration: 5000,
        });
      else
        toast.error("خطا در تولید طرح", {
          description: "لطفاً دوباره تلاش کنید.",
        });
    },
  });

  const saveGalleryMutation = useMutation({
    mutationFn: (formData: FormData) => galleryApi.create(formData),
  });

  const handleSelectAttribute = (slug: string, value: string) => {
    const next = { ...selected, [slug]: value };
    if (!designableProduct || !findVariant(designableProduct, next)) {
      toast.error("این ترکیب موجود نیست");
      return;
    }
    setSelected(next);
    const t = attributePromptMap[slug]?.[value];
    if (t) setAutoPromptParts((prev) => ({ ...prev, [slug]: t }));
  };

  const handlePreset = (preset: (typeof stylePresets)[number]) => {
    if (selectedPreset === preset.id) {
      setSelectedPreset(null);
      setAutoPromptParts((prev) => {
        const n = { ...prev };
        delete n.style;
        return n;
      });
      return;
    }
    setSelectedPreset(preset.id);
    setAutoPromptParts((prev) => ({
      ...prev,
      style: { fa: preset.fa, en: preset.en },
    }));
  };

  const handlePalette = (palette: (typeof colorPalettes)[number]) => {
    setAutoPromptParts((prev) => ({
      ...prev,
      palette: { fa: palette.name, en: palette.en },
    }));
  };

  const handleGenerate = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (quota?.remaining === 0) {
      toast.error("سقف ماهانه تمام شد 😔", {
        description: "ماه آینده دوباره فعال می‌شود.",
        duration: 5000,
      });
      return;
    }

    const enParts = Object.values(autoPromptParts)
      .map((p) => p.en)
      .filter(Boolean);
    const sizeSlug = selected["size"] || selected["volume"] || "220cc";

    const finalPrompt = buildFinalPrompt({
      userPrompt: prompt,
      autoPartsEn: enParts,
      sizeSlug,
      brandName,
      hasLogo: !!logoFile,
    });

    if (!finalPrompt.trim()) {
      toast.error("یک پرامپت وارد کنید یا گزینه‌ای انتخاب کنید");
      return;
    }

    const payload: GenerateAiPayload = {
      prompt: finalPrompt,
      ...(logoFile && { logo_file: logoFile }),
      ...(referenceFiles.length > 0 && { reference_files: referenceFiles }),
    };

    generateAiMutation.mutate(payload);
  };

  const handleSave = async () => {
    if (!generatedImage || !designName.trim()) {
      toast.error("یک نام برای طرح وارد کنید");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      await saveDesign.mutateAsync({
        name: designName.trim(),
        thumbnail: blob,
      });
      const formData = new FormData();
      formData.append("title", designName.trim());
      formData.append("image", blob, `${designName.trim()}.png`);
      await saveGalleryMutation.mutateAsync(formData);
      toast.success("طرح ذخیره شد", {
        description: `«${designName}» به طرح‌ها و گالری اضافه شد.`,
      });
      setDesignName("");
    } catch {
      toast.error("ذخیره ناموفق بود");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-8 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
            طراح هوش مصنوعی
          </h1>
          <p className="text-muted-foreground">
            ایده‌ات را بگو، هوش مصنوعی طرح را برایت می‌سازد.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-16 items-start">
          <div className="w-full lg:sticky lg:top-28 min-w-0">
            <DesignerCanvas
              generatedImage={generatedImage}
              isGenerating={generateAiMutation.isPending}
            />
          </div>

          <div className="flex flex-col gap-7 min-w-0">
            {/* انتخاب محصول */}
            <div className="bg-secondary/40 rounded-3xl p-6">
              <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">
                انتخاب محصول
              </p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">
                  در حال بارگذاری...
                </p>
              ) : designableProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  فعلاً محصولی برای طراحی فعال نشده
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {designableProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setSelected({});
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedProductId === p.id
                          ? "bg-foreground text-background"
                          : "bg-white text-muted-foreground hover:text-foreground border border-border/50"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* تنظیمات variant */}
            {product && (
              <div className="bg-secondary/40 rounded-3xl p-6 space-y-6">
                <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  تنظیمات سفارش
                </p>
                {attributeGroups.map((group) => (
                  <div key={group.slug}>
                    <p className="text-sm font-medium mb-2.5">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleSelectAttribute(group.slug, value)
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            selected[group.slug] === value
                              ? "bg-foreground text-background"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <DesignerBrandPanel
              brandName={brandName}
              onBrandNameChange={setBrandName}
              logoFile={logoFile}
              logoPreview={logoPreview}
              onLogoSelect={(f) => {
                setLogoFile(f);
                setLogoPreview(URL.createObjectURL(f));
              }}
              onLogoClear={() => {
                setLogoFile(null);
                setLogoPreview(null);
              }}
            />

            <DesignerReferencePanel
              referenceFiles={referenceFiles}
              referencePreviews={referencePreviews}
              onAdd={(f) => {
                setReferenceFiles((p) => [...p, f]);
                setReferencePreviews((p) => [...p, URL.createObjectURL(f)]);
              }}
              onRemove={(i) => {
                setReferenceFiles((p) => p.filter((_, j) => j !== i));
                setReferencePreviews((p) => p.filter((_, j) => j !== i));
              }}
            />
            <DesignerPromptPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              autoPromptParts={autoPromptParts}
              selectedPreset={selectedPreset}
              onPreset={handlePreset}
              onPalette={handlePalette}
              onSuggestion={(text) =>
                setPrompt((prev) => (prev ? `${prev}، ${text}` : text))
              }
              uploadedFile={uploadedFile}
              uploadedPreview={uploadedPreview}
              onFileSelect={(file) => {
                setUploadedFile(file);
                setUploadedPreview(URL.createObjectURL(file));
              }}
              onFileClear={() => {
                setUploadedFile(null);
                setUploadedPreview(null);
              }}
              generatedImage={generatedImage}
              isGenerating={generateAiMutation.isPending}
              quota={quota}
              designName={designName}
              onDesignNameChange={setDesignName}
              isSaving={isSaving}
              onGenerate={handleGenerate}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
