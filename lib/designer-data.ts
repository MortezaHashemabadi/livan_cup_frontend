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
  },
  surface: {
    صاف: { fa: "سطح صاف", en: "smooth outer surface" },
    موج‌دار: { fa: "سطح موج‌دار", en: "rippled outer surface" },
    برجسته: { fa: "سطح برجسته", en: "embossed outer surface" },
  },
};



export const stylePresets = [
  {
    id: "doodle_illustration",
    name: "دودل ایلوستریشن",
    image: "/ai-design-doodle.png",
    fa: "دودل ایلوستریشن",
    en: "playful hand-drawn doodle illustration, whimsical sketchy line characters and objects, black ink on cream background, quirky zine-style composition",
  },
  {
    id: "typography",
    name: "تایپوگرافی",
    image: "/ai-design-typography.png",
    fa: "سبک تایپوگرافی",
    en: "bold modern typography design, clean sans-serif lettering as the central pattern, geometric grid layout, high-contrast color blocking",
  },
  {
    id: "character",
    name: "کاراکتر",
    image: "/ai-design-characters.png",
    fa: "سبک کاراکتری",
    en: "cute character-driven illustration, whimsical mascot figures with expressive faces, flat vibrant colors, friendly rounded shapes",
  },
  {
    id: "vintage",
    name: "وینتیج",
    image: "/ai-design-vintage.png",
    fa: "سبک وینتیج",
    en: "vintage retro design, aged paper texture with warm sepia tones, classic serif lettering, nostalgic old-world ornamental details",
  },
  {
    id: "abstract_art",
    name: "هنر انتزاعی",
    image: "/ai-design-abstract.png",
    fa: "سبک هنر انتزاعی",
    en: "abstract fine-art style, expressive brushstrokes and organic shapes, bold color-block composition, gallery-quality contemporary feel",
  },
  {
    id: "boho_minimal",
    name: "بوهو مینیمال",
    image: "/ai-design-boho.png",
    fa: "سبک بوهو مینیمال",
    en: "boho minimal style, muted earthy color palette, delicate fine linework, relaxed organic layout with airy negative space",
  },
  {
    id: "line_art_illustration",
    name: "خط‌نگاره",
    image: "/ai-design-lineart.png",
    fa: "سبک خط‌نگاره ایلوستریتیو",
    en: "intricate black line art illustration, dense surreal character composition, fine continuous linework on cream background, zine-style hand-drawn aesthetic",
  },
  {
    id: "risograph",
    name: "ریسوگراف",
    image: "/ai-design-risograph.png",
    fa: "سبک چاپ ریسوگراف",
    en: "riso print style, limited color layers with visible offset misregistration, grainy halftone texture, bold flat shapes",
  },
  {
    id: "art_deco",
    name: "آرت دکو",
    image: "/ai-design-artdeco.png",
    fa: "سبک آرت دکو لوکس",
    en: "art deco design, symmetrical geometric linework, gold and black palette, elegant 1920s luxury motifs",
  },
  {
    id: "scandinavian_folk",
    name: "فولک اسکاندیناوی",
    image: "/ai-design-scandi.png",
    fa: "سبک فولک اسکاندیناوی",
    en: "scandinavian folk art style, stylized birds and botanical shapes, muted earthy color palette, flat decorative pattern",
  },
  {
    id: "memphis_pattern",
    name: "ممفیس",
    image: "/ai-design-memphis.png",
    fa: "سبک پترن ممفیس",
    en: "memphis design pattern, playful geometric shapes in bold colors, squiggles and confetti dots on neutral background, postmodern 80s energy",
  },
  {
    id: "watercolor_botanical",
    name: "آبرنگ گیاهی",
    image: "/ai-design-watercolor.png",
    fa: "سبک آبرنگ گیاهی",
    en: "soft watercolor botanical painting, natural pigment bleed, delicate leaves and florals, handmade premium feel",
  },
  {
    id: "ukiyo_e_wave",
    name: "اوکیو-اِ",
    image: "/ai-design-ukiyoe.png",
    fa: "سبک اوکیو-اِ ژاپنی",
    en: "traditional Japanese ukiyo-e woodblock print style, stylized waves and clouds, limited indigo and cream palette, fine outline work",
  },
  {
    id: "brutalist_type",
    name: "برو‌تالیست",
    image: "/ai-design-brutalist.png",
    fa: "سبک تایپوگرافی برو‌تالیست",
    en: "brutalist typography design, oversized cropped letterforms, stark black and white contrast, raw modern grid layout",
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