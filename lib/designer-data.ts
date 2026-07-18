export const attributePromptMap: Record<
  string,
  Record<string, { fa: string; en: string }>
> = {
  size: {
    "80cc": { fa: "لیوان اسپرسو ۸۰ سی‌سی", en: "80cc espresso cup" },
    "120cc": { fa: "لیوان کورتادو ۱۲۰ سی‌سی", en: "120cc cortado cup" },
    "220cc": { fa: "لیوان لاته ۲۲۰ سی‌سی", en: "220cc latte cup" },
    "330cc": { fa: "لیوان بزرگ ۳۳۰ سی‌سی", en: "330cc large cup" },
    "400cc": { fa: "لیوان فوق‌بزرگ ۴۰۰ سی‌سی", en: "400cc extra large cup" },
  },
  material: {
    کرافت: { fa: "جنس کرافت قهوه‌ای", en: "kraft brown material" },
    براق: { fa: "جنس براق", en: "glossy surface material" },
    مات: { fa: "جنس مات", en: "matte surface material" },
    بازیافتی: { fa: "جنس بازیافتی", en: "recycled eco-friendly material" },
  },
  surface: {
    صاف: { fa: "سطح صاف", en: "smooth outer surface" },
    موج‌دار: { fa: "سطح موج‌دار", en: "rippled outer surface" },
    برجسته: { fa: "سطح برجسته", en: "embossed outer surface" },
  },
};

export const stylePresets = [
  {
    id: "minimal_cafe",
    name: "کافه مینیمال",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/df9782f62_generated_ae760354.png",
    fa: "سبک کافه مینیمال",
    en: "minimalist cafe style, warm earthy tones, modern typography",
  },
  {
    id: "modern_geometric",
    name: "هندسی مدرن",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/8825e30b7_generated_d6d3c25a.png",
    fa: "سبک هندسی مدرن",
    en: "modern geometric patterns, pastel colors, abstract contemporary style",
  },
  {
    id: "vintage_coffee",
    name: "رترو",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/072b53e63_generated_e4ada157.png",
    fa: "سبک رترو",
    en: "vintage coffee shop branding, retro typography, warm brown tones",
  },
  {
    id: "luxury_gold",
    name: "لوکس طلایی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/98e1fafbd_generated_4cff30a3.png",
    fa: "سبک لوکس طلایی",
    en: "premium luxury design, gold foil details, dark navy background",
  },
  {
    id: "japanese_minimal",
    name: "ژاپنی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/30c1cec38_generated_c8cfc160.png",
    fa: "سبک ژاپنی مینیمال",
    en: "Japanese wabi-sabi style, cherry blossom, soft natural colors",
  },
  {
    id: "botanical",
    name: "گیاهی",
    image:
      "https://media.db.com/images/public/6a37a714a93b14f8cbd64720/485eade45_generated_c7f34772.png",
    fa: "سبک گیاهی",
    en: "hand-painted botanical illustration, leaves and flowers, soft green tones",
  },
];

export const colorPalettes = [
  {
    name: "کرم و آبی",
    en: "cream and blue color palette",
    colors: ["#FFF8F0", "#DCEEFF", "#7BB6FF", "#222222"],
  },
  {
    name: "نعناعی و کرافت",
    en: "mint and kraft color palette",
    colors: ["#E4F7EE", "#C9A96E", "#2D5016", "#F5F0E8"],
  },
  {
    name: "هلویی و طلایی",
    en: "peach and gold color palette",
    colors: ["#FFE6D6", "#D4A574", "#8B6914", "#FFF8F0"],
  },
  {
    name: "سرمه‌ای و سفید",
    en: "navy and white color palette",
    colors: ["#1A2332", "#FFFFFF", "#C8A97E", "#4A5568"],
  },
];

export const promptSuggestions = [
  "رنگ‌های گرم و طبیعی",
  "تایپوگرافی بولد",
  "پترن هندسی",
  "سبک اسکاندیناوی",
  "رنگ‌بندی پاستلی",
  "طرح گیاهی",
  "مینیمال مدرن",
  "ست رنگی آبی",
  "لوگو مرکزی",
  "گرادیانت ملایم",
];

export const sizeDescriptions: Record<string, string> = {
  "80cc": "small 80cc espresso cup, short and compact proportions, 60mm tall",
  "120cc": "120cc cortado cup, small compact proportions, 80mm tall",
  "220cc": "standard 220cc latte cup, medium proportions, 105mm tall",
  "330cc": "large 330cc cup, tall proportions, 120mm tall",
  "400cc": "extra large 400cc cup, tall and slender proportions, 140mm tall",
};

export function buildFinalPrompt({
  userPrompt,
  autoPartsEn,
  sizeSlug,
  brandName,
  hasLogo,
}: {
  userPrompt: string;
  autoPartsEn: string[];
  sizeSlug: string;
  brandName: string;
  hasLogo: boolean;
}): string {
  const sizeDesc = sizeDescriptions[sizeSlug] || "paper coffee cup";
  const styleText = [...autoPartsEn, userPrompt.trim()]
    .filter(Boolean)
    .join(", ");
  const brandClause = brandName.trim()
    ? ` The design should feature the brand name "${brandName.trim()}" rendered clearly and elegantly on the cup, integrated naturally into the wrap-around pattern.`
    : "";
  const logoClause = hasLogo
    ? " Use the provided logo as a reference for style, color palette, and visual identity — match its aesthetic and incorporate it naturally onto the cup."
    : "";
  return `Design for a disposable paper coffee cup (${sizeDesc}). ${styleText}.${brandClause}${logoClause} The cup must be a paper cup with a visible paper texture and rolled rim, not plastic, glass, or ceramic. The cup shape and proportions must match this exact size. Wrap-around pattern for a cylindrical paper cup. Premium studio photography, soft lighting, cream background, no people.`;
}