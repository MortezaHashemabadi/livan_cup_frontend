import { ApiError } from "./types";

function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("؛ ");
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("detail" in obj) return extractText(obj.detail);
    return Object.values(obj).map(extractText).filter(Boolean).join("؛ ");
  }
  return "";
}

/**
 * پیام قابل‌نمایش به کاربر را از خطای API بیرون می‌کشد
 * (detail، خطاهای فیلد و non_field_errors). برای خطای سرور یا شبکه، fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  if (error.status === 429) {
    return "تعداد درخواست‌ها بیش از حد مجاز است؛ لطفاً کمی بعد دوباره تلاش کنید";
  }
  if (error.status >= 500) return fallback;
  return extractText(error.payload) || fallback;
}
