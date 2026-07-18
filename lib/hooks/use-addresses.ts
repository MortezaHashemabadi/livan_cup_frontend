"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { accountsApi } from "../api/endpoints/accounts";
import type { Address } from "../api/types";

export function useAddresses() {
  return useQuery({ queryKey: ["addresses"], queryFn: accountsApi.addresses });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Address, "id">) =>
      accountsApi.createAddress(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Omit<Address, "id">>;
    }) => accountsApi.updateAddress(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountsApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
