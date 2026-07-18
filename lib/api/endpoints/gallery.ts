import { api } from "../client";

export interface GalleryImage {
  id: number;
  image: string;
  title: string;
  tag: string;
  order: number;
}

export const galleryApi = {
  list: (tag?: string) =>
    api.get<GalleryImage[]>(`/gallery/${tag ? `?tag=${tag}` : ""}`),
  create: (formData: FormData) =>
    api.post<GalleryImage>("/gallery/submit/", formData, { isFormData: true }),
};

