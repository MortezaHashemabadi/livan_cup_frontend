"use client";
import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "../api/endpoints/gallery";

export function useGallery(tag?: string) {
  return useQuery({
    queryKey: ["gallery", tag],
    queryFn: () => galleryApi.list(tag),
  });
}
