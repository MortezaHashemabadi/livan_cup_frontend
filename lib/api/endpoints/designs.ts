import { api } from "../client";

export interface Design {
  id: number;
  name: string;
  design_data: Record<string, unknown>;
  thumbnail: string | null;
}

export interface GenerateAiPayload {
  prompt: string;
  existing_image_urls?: string[];
  logo_file?: File;
  reference_files?: File[];
}

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
}

export interface GenerateAiResponse {
  url: string;
  quota: QuotaInfo;
}

export const designsApi = {
  list: () => api.get<Design[]>("/designs/"),
  create: (formData: FormData) =>
    api.post<Design>("/designs/", formData, { isFormData: true }),
  update: (id: number, formData: FormData) =>
    api.patch<Design>(`/designs/${id}/`, formData, { isFormData: true }),
  delete: (id: number) => api.delete(`/designs/${id}/`),
};



export const aiApi = {
  generateImage: (payload: GenerateAiPayload) => {
    const hasFiles = payload.logo_file || payload.reference_files?.length;
    if (hasFiles) {
      const formData = new FormData();
      formData.append("prompt", payload.prompt);
      if (payload.logo_file) formData.append("logo_file", payload.logo_file);
      payload.reference_files?.forEach((f) =>
        formData.append("reference_files", f),
      );
      payload.existing_image_urls?.forEach((url) =>
        formData.append("existing_image_urls", url),
      );
      return api.post<GenerateAiResponse>("/ai/images/generate/", formData, {
        isFormData: true,
      });
    }
    return api.post<GenerateAiResponse>("/ai/images/generate/", {
      prompt: payload.prompt,
    });
  },
  quotaStatus: () => api.get<QuotaInfo>("/ai/quota/"),
};