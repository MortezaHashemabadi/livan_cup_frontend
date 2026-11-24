"use client";
import { useCallback, useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  /** نمایش لودر (shimmer) تا لود شدن عکس. برای عکس‌های روی هم (مثل hover) false بزن */
  skeleton?: boolean;
  /** انیمیشن fade-in بعد از لود. برای عکس hover باید false باشد */
  fade?: boolean;
}

/**
 * جای <img> معمولی. تا وقتی عکس کامل لود نشده مخفی است و یک shimmer نشون می‌دهد،
 * بعد کامل و یکجا fade-in می‌شود (دیگه از بالا به پایین رندر نمی‌شود).
 * والد باید position: relative داشته باشد (مثلاً کلاس `relative`).
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  style,
  skeleton = true,
  fade = true,
  loading = "lazy",
  decoding = "async",
  onLoad,
  onError,
  ...rest
}: LazyImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;
  const failed = failedSrc === src;

  // اگر عکس قبل از hydrate شدن (یا از کش) لود شده باشد onLoad رو از دست می‌دهیم؛ اینجا چک می‌کنیم
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete) {
        if (img.naturalWidth > 0) setLoadedSrc(src);
        else setFailedSrc(src);
      }
    },
    [src],
  );

  if (failed) {
    return skeleton ? (
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageOff className="w-8 h-8 text-muted-foreground/25" />
      </div>
    ) : null;
  }

  return (
    <>
      {skeleton && (
        <div
          aria-hidden
          className={`lazy-skeleton absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={`${className} ${loaded && fade ? "lazy-fade-in" : ""}`}
        style={loaded ? style : { ...style, opacity: 0 }}
        onLoad={(e) => {
          setLoadedSrc(src);
          onLoad?.(e);
        }}
        onError={(e) => {
          setFailedSrc(src);
          onError?.(e);
        }}
        {...rest}
      />
    </>
  );
}
