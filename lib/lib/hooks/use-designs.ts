"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { designsApi, type Design } from "../api/endpoints/designs";
import { resolveMediaUrl } from "../media";

export function useDesigns() {
  return useQuery({ queryKey: ["designs"], queryFn: designsApi.list });
}

export function useDeleteDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => designsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designs"] }),
  });
}

export function useDuplicateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (design: Design) => {
      const formData = new FormData();
      formData.append("name", `${design.name} (کپی)`);
      formData.append("design_data", JSON.stringify(design.design_data));
      // بک‌اند آدرس مطلق می‌دهد؛ resolveMediaUrl هر دو حالت را درست می‌کند
      const thumbnailUrl = resolveMediaUrl(design.thumbnail);
      if (thumbnailUrl) {
        const res = await fetch(thumbnailUrl);
        if (res.ok) {
          formData.append("thumbnail", await res.blob(), "thumbnail.png");
        }
      }
      return designsApi.create(formData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designs"] }),
  });
}
export function useSaveDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      thumbnail,
      designData,
    }: {
      name: string;
      thumbnail: Blob | File;
      designData?: Record<string, unknown>;
    }) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("design_data", JSON.stringify(designData || {}));
      formData.append("thumbnail", thumbnail, "thumbnail.png");
      return designsApi.create(formData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designs"] }),
  });
}