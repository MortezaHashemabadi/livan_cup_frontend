import { api } from "../client";
import type { Address } from "../types";

export interface BusinessProfile {
  business_name: string;
  business_type: string;
  economic_code: string;
  national_id: string;
  position: string;
}

export const accountsApi = {
  me: () => api.patch("/accounts/me/"),
  addresses: () => api.get<Address[]>("/accounts/addresses/"),
  createAddress: (payload: Omit<Address, "id">) =>
    api.post<Address>("/accounts/addresses/", payload),
  updateAddress: (id: number, payload: Partial<Omit<Address, "id">>) =>
    api.patch<Address>(`/accounts/addresses/${id}/`, payload),
  deleteAddress: (id: number) => api.delete(`/accounts/addresses/${id}/`),
  businessProfile: () =>
    api.get<BusinessProfile>("/accounts/business-profile/"),
  updateBusinessProfile: (payload: Partial<BusinessProfile>) =>
    api.patch<BusinessProfile>("/accounts/business-profile/", payload),
};
