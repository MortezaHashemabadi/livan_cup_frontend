"use client";

import { useEffect } from "react";
import InfiniteGallery from "@/components/gallery/InfiniteGallery";
import { useGallery } from "@/lib/hooks/use-gallery";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

export default function GalleryPage() {
  const { data: galleryImages = [], isLoading } = useGallery();

  const images = galleryImages.map((img) => ({
    src: img.image.startsWith("http")
      ? img.image
      : `${NEXT_PUBLIC_MEDIA_URL}${img.image}`,
    name: img.title || img.tag || "طرح لیوان",
  }));

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (isLoading)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#FFF8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
      </div>
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF8F0",
      }}
    >
      <InfiniteGallery items={images} />
    </div>
  );
}
