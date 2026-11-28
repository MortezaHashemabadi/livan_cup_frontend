export const MEDIA_URL = (
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

/**
 * آدرس فایل رسانه را کامل می‌کند: آدرس مطلق (طرح‌ها) همان‌طور می‌ماند و
 * آدرس نسبی (تصاویر محصول مثل /media/...) با MEDIA_URL شروع می‌شود.
 */
export function resolveMediaUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url)) return url;
  return `${MEDIA_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
