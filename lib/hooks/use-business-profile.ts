"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { accountsApi, type BusinessProfile } from "../api/endpoints/accounts";

export function useBusinessProfile() {
  return useQuery({
    queryKey: ["business-profile"],
    queryFn: accountsApi.businessProfile,
  });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BusinessProfile>) =>
      accountsApi.updateBusinessProfile(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["business-profile"] }),
  });
}
