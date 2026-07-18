"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewsSection from "@/components/products/ReviewsSection";
import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Loader2,
  Check,
  Upload,
  X,
  Users,
} from "lucide-react";
import RecommendedProducts from "@/components/products/RecommendedProducts";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useProduct } from "@/lib/hooks/use-catalog";
import {
  getAttributeGroups,
  findVariant,
  getUnitPrice,
  getVariantImage,
} from "@/lib/api/endpoints/catalog";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useDesigns } from "@/lib/hooks/use-designs";
import { FolderOpen, Wand2 } from "lucide-react";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

const stylePresets = [
  {
    id: "minimal_cafe",
    name: "کافه مینیمال",
    prompt: "طراحی مینیمال با رنگ‌های خاکی ملایم و تایپوگرافی مدرن.",
  },
  {
    id: "modern_geometric",
    name: "هندسی مدرن",
    prompt: "الگوهای هندسی پررنگ با رنگ‌های پاستلی، سبک انتزاعی معاصر.",
  },
  {
    id: "vintage_coffee",
    name: "رترو",
    prompt: "برندینگ قهوه‌خانه‌ی قدیمی با تایپوگرافی وینتیج و رنگ قهوه‌ای گرم.",
  },
  {
    id: "luxury_gold",
    name: "لوکس طلایی",
    prompt: "طراحی پرمیوم با جزئیات فویل طلایی و پس‌زمینه‌ی سرمه‌ای.",
  },
  {
    id: "japanese_minimal",
    name: "ژاپنی",
    prompt: "سبک وابی‌سابی با شکوفه‌ی گیلاس و رنگ‌های ملایم طبیعی.",
  },
  {
    id: "botanical",
    name: "گیاهی",
    prompt: "نقاشی‌های دستی گیاهی با برگ و گل در تن‌های سبز کم‌رنگ.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

const displayImageRef = { current: null as string | null };

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const variantIdFromUrl = searchParams.get("variant");
  const { data: product, isLoading } = useProduct(slug);
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(100);
  const { data: savedDesigns = [] } = useDesigns();
  const [selectedDesignId, setSelectedDesignId] = useState<number | null>(null);
  // طراحی
  const [designMode, setDesignMode] = useState<
    "ai" | "upload" | "consultation"
  >("ai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!product) return;
    const target = variantIdFromUrl
      ? product.variants.find((v) => v.id === Number(variantIdFromUrl))
      : null;
    const fallback =
      product.variants.find((v) => v.stock_status === "in_stock") ||
      product.variants[0];
    const chosen = target || fallback;
    if (chosen) {
      const initial: Record<string, string> = {};
      chosen.attribute_values.forEach((av) => {
        initial[av.attribute_slug] = av.value;
      });
      setSelected(initial);
      setQuantity(chosen.price_tiers[0]?.min_quantity ?? 100);
    }
  }, [product, variantIdFromUrl]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("فایل تصویری انتخاب کنید");
      return;
    }
    setUploadedFiles((prev) => [...prev, file]);
    setUploadedPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  };


  if (isLoading) {
    return (
      <div className="pt-8 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square rounded-[40px]" />
          <div className="space-y-4 pt-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-8 pb-20 text-center">
        <p className="text-muted-foreground mb-4">محصول پیدا نشد</p>
        <Link href="/products" className="text-cobalt hover:underline">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const attributeGroups = getAttributeGroups(product);
  const matchedVariant = findVariant(product, selected);
  const unitPrice = matchedVariant
    ? getUnitPrice(matchedVariant, quantity)
    : null;
  const totalPrice = unitPrice !== null ? unitPrice * quantity : null;

  const variantImage = matchedVariant ? getVariantImage(matchedVariant) : null;
  const baseImage = variantImage
    ? `${NEXT_PUBLIC_MEDIA_URL}${variantImage}`
    : null;


  const displayImage = baseImage;
  displayImageRef.current = baseImage;

  const handleSelect = (groupSlug: string, value: string) => {
    const next = { ...selected, [groupSlug]: value };
    const exists = findVariant(product, next);
    if (!exists) {
      toast.error("این ترکیب موجود نیست");
      return;
    }
    setSelected(next);
  };

  const handleAddToCart = () => {
    if (!matchedVariant) return;
    if (matchedVariant.stock_status !== "in_stock") {
      toast.error("این ترکیب در حال حاضر موجود نیست");
      return;
    }
    // اگه چند فایل آپلود شده، برای هر فایل یه آیتم جدا اضافه می‌کنیم
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        addItem(
          matchedVariant.id,
          quantity,
          selectedDesignId ?? undefined,
          file,
        );
        if (designMode === "consultation") {
          sessionStorage.setItem("needs_design_consultation", "1");
        }
      });
    } else {
      addItem(matchedVariant.id, quantity, selectedDesignId ?? undefined);
      if (designMode === "consultation") {
        sessionStorage.setItem("needs_design_consultation", "1");
      }
    }
  };

  return (
    <div className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          بازگشت به محصولات
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="relative rounded-[40px] bg-cream overflow-hidden aspect-square">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayImage ?? "placeholder"}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {matchedVariant?.stock_status === "out_of_stock" && (
                <div className="absolute top-5 right-5 bg-destructive text-white rounded-full px-3 py-1.5 text-xs font-semibold">
                  ناموجود
                </div>
              )}

              

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                >
                  <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
                  <p className="text-sm font-medium text-foreground">
                    در حال ساخت طرح…
                  </p>
                </motion.div>
              )}
            </div>

            {matchedVariant && (
              <div className="bg-secondary rounded-3xl p-6">
                <h3 className="font-heading font-semibold text-sm mb-4">
                  تعرفه‌ی پله‌ای
                </h3>
                <div className="space-y-2">
                  {matchedVariant.price_tiers.map((tier, i) => {
                    const isActive =
                      quantity >= tier.min_quantity &&
                      (tier.max_quantity === null ||
                        quantity <= tier.max_quantity);
                    const rangeLabel =
                      tier.max_quantity === null
                        ? `${tier.min_quantity.toLocaleString("fa-IR")}+ عدد`
                        : `${tier.min_quantity.toLocaleString("fa-IR")} – ${tier.max_quantity.toLocaleString("fa-IR")} عدد`;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl ${isActive ? "bg-cobalt/10 border border-cobalt/20" : "bg-background/60"}`}
                      >
                        <span className="text-sm text-muted-foreground">
                          {rangeLabel}
                        </span>
                        <span
                          className={`font-heading font-bold text-sm ${isActive ? "text-cobalt" : "text-foreground"}`}
                        >
                          {parseFloat(tier.unit_price).toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-border/50 p-6 space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    قیمت واحد
                  </p>
                  <p className="font-display font-extrabold text-3xl">
                    {unitPrice !== null
                      ? `${unitPrice.toLocaleString("fa-IR")} تومان`
                      : "تعیین نشده"}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 50))}
                    className="w-9 h-9 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-medium text-sm w-16 text-center">
                    {quantity.toLocaleString("fa-IR")} عدد
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 50)}
                    className="w-9 h-9 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={
                  !matchedVariant || matchedVariant.stock_status !== "in_stock"
                }
                className={`w-full rounded-full h-14 font-medium text-base shadow-none ${
                  matchedVariant?.stock_status === "coming_soon"
                    ? "bg-soft-peach text-orange-700 hover:bg-soft-peach/90"
                    : matchedVariant?.stock_status === "out_of_stock"
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/10"
                      : "bg-foreground hover:bg-foreground/90 text-background"
                }`}
              >
                {matchedVariant?.stock_status === "coming_soon" ? (
                  "به‌زودی موجود می‌شود"
                ) : matchedVariant?.stock_status === "out_of_stock" ? (
                  "ناموجود"
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 ml-2" />
                    افزودن به سبد{" "}
                    {totalPrice !== null &&
                      `— ${totalPrice.toLocaleString("fa-IR")} تومان`}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-7">
            <div>
              <Badge className="bg-cobalt/10 text-cobalt border-0 rounded-full px-3 py-1 mb-3">
                <Sparkles className="w-3 h-3 ml-1" />
                {product.category}
              </Badge>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-secondary/40 rounded-3xl p-6 space-y-6">
              <SectionLabel>تنظیمات سفارش</SectionLabel>
              {attributeGroups.map((group) => (
                <div key={group.slug}>
                  <p className="text-sm font-medium mb-2.5">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleSelect(group.slug, value)}
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
              {matchedVariant && (
                <p className="text-xs text-muted-foreground/50">
                  کد محصول: {matchedVariant.sku}
                </p>
              )}
            </div>

            <div className="bg-secondary/40 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <SectionLabel>گزینه‌های طراحی</SectionLabel>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      mode: "ai",
                      icon: FolderOpen,
                      title: "طرح‌های ذخیره‌شده",
                      desc: "از طرح‌های قبلی استفاده کن",
                    },
                    {
                      mode: "upload",
                      icon: Upload,
                      title: "آپلود طرح",
                      desc: "فایل آماده خودت را آپلود کن",
                    },
                    {
                      mode: "consultation",
                      icon: Users,
                      title: "مشاوره طراحی",
                      desc: "تیم طراحی بعد از ثبت سفارش با شما تماس می‌گیرد",
                    },
                  ].map(({ mode, icon: Icon, title, desc }) => (
                    <button
                      key={mode}
                      onClick={() => setDesignMode(mode as any)}
                      className={`relative rounded-2xl p-4 text-right transition-all duration-200 border-2 ${
                        designMode === mode
                          ? "border-cobalt bg-white shadow-sm"
                          : "border-transparent bg-secondary/60 hover:bg-secondary"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                          designMode === mode ? "bg-cobalt/10" : "bg-secondary"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            designMode === mode
                              ? "text-cobalt"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>

                      <p
                        className={`text-sm font-semibold mb-0.5 ${
                          designMode === mode
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {title}
                      </p>

                      <p className="text-xs text-muted-foreground leading-snug">
                        {desc}
                      </p>

                      {designMode === mode && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cobalt flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {designMode === "ai" && (
                  <motion.div
                    key="designs-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-4 border-t border-border/30">
                      <div className="rounded-2xl bg-white border border-border/50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            طرح مورد نظر را انتخاب کنید
                          </p>
                          <Link
                            href="/designer"
                            className="flex items-center gap-1 text-xs font-medium text-cobalt hover:opacity-80 transition-opacity"
                          >
                            <Wand2 className="w-3 h-3" />
                            طرح جدید
                          </Link>
                        </div>

                        {savedDesigns.length === 0 ? (
                          <div className="text-center py-8">
                            <FolderOpen className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">
                              هنوز طرحی ذخیره نشده
                            </p>
                            <Link href="/designer">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full gap-2"
                              >
                                <Wand2 className="w-3.5 h-3.5" />
                                تولید طرح با هوش مصنوعی
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {savedDesigns.map((design) => (
                              <button
                                key={design.id}
                                onClick={() =>
                                  setSelectedDesignId(
                                    selectedDesignId === design.id
                                      ? null
                                      : design.id,
                                  )
                                }
                                className={`relative group rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                                  selectedDesignId === design.id
                                    ? "border-cobalt shadow-sm"
                                    : "border-transparent hover:border-cobalt/30"
                                }`}
                              >
                                {design.thumbnail ? (
                                  <img
                                    src={design.thumbnail}
                                    alt={design.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                                    <Wand2 className="w-5 h-5 text-muted-foreground/30" />
                                  </div>
                                )}
                                {selectedDesignId === design.id && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-cobalt flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <p className="text-[9px] text-white truncate">
                                    {design.name || "بدون نام"}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {designMode === "upload" && (
                  <motion.div
                    key="upload-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-4 border-t border-border/30 space-y-4">
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          Array.from(e.dataTransfer.files).forEach(
                            handleFileSelect,
                          );
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${isDragOver ? "border-cobalt bg-cobalt/5" : "border-border/50 bg-white hover:border-cobalt/40 hover:bg-secondary/30"}`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium mb-0.5">
                            فایل‌ها را رها کنید
                          </p>
                          <p className="text-xs text-muted-foreground">
                            یا کلیک کنید · PNG, JPG, SVG · چند فایل
                          </p>
                        </div>
                      </div>

                      {uploadedPreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedPreviews.map((preview, i) => (
                            <div key={i} className="relative group">
                              <div className="rounded-2xl overflow-hidden aspect-square bg-cream">
                                <img
                                  src={preview}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  setUploadedFiles((prev) =>
                                    prev.filter((_, j) => j !== i),
                                  );
                                  setUploadedPreviews((prev) =>
                                    prev.filter((_, j) => j !== i),
                                  );
                                }}
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                                {uploadedFiles[i]?.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          Array.from(e.target.files || []).forEach(
                            handleFileSelect,
                          );
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </motion.div>
                )}
                {designMode === "consultation" && (
                  <motion.div
                    key="consultation-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-4 border-t border-border/30">
                      <div className="rounded-2xl bg-white border border-border/50 p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cobalt/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Users className="w-4 h-4 text-cobalt" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              تیم طراحی با شما تماس خواهد گرفت
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              نیازی به آپلود فایل یا تولید هوش مصنوعی نیست. پس
                              از ثبت سفارش شما، تیم طراحی ما با شما تماس خواهد
                              گرفت تا نیازهای شما را جمع‌آوری کرده و با توجه به
                              دیزاین مد نظر شما لیوان شما را طراحی میکنند.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-xl bg-soft-blue/40 border border-cobalt/10 px-4 py-3">
                          <p className="text-xs text-cobalt/80 leading-relaxed text-right">
                            پس از ثبت سفارش، تیم طراحی با شما تماس خواهد گرفت و
                            طرح مورد نظر شما را دریافت و آماده‌سازی خواهد کرد.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          معمولا ظرف ۱ روز کاری
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-8">
          <RecommendedProducts
            variants={matchedVariant?.related_variants ?? []}
          />
          <ReviewsSection productId={product.id} />
        </div>
      </div>
    </div>
  );
}
