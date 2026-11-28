"use client";
import { createContext, useContext, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { cartApi, type Cart } from "./api/endpoints/cart";
import { useAuth } from "./auth-context";
import { useAuthModal } from "./auth-modal-context";
import { toast } from "sonner";
import { getApiErrorMessage } from "./api/errors";

interface CartContextValue {
  cart: Cart | undefined;
  totalItems: number;
  /** تعداد ردیف‌های سبد (برای نشانگر هدر؛ جمع تعداد در سفارش عمده بزرگ می‌شود) */
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (
    variant: number,
    quantity: number,
    design?: number,
    printFile?: File,
    selectedOptionIds?: number[],
    fabricColor?: string,
    printColor?: string,
    topColor?: string,
    bottomColor?: string,
  ) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const queryClient = useQueryClient();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: isAuthenticated,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const addMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      invalidate();
      toast.success("به سبد اضافه شد");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "افزودن به سبد ناموفق بود")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.updateItem(id, { quantity }),
    onSuccess: invalidate,
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "بروزرسانی تعداد ناموفق بود")),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onSuccess: invalidate,
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "حذف آیتم ناموفق بود")),
  });

  const addItem = async (
    variant: number,
    quantity: number,
    design?: number,
    printFile?: File,
    selectedOptionIds?: number[],
    fabricColor?: string,
    printColor?: string,
    topColor?: string,
    bottomColor?: string,
  ) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    await addMutation.mutateAsync({
      variant,
      design,
      quantity,
      print_file: printFile,
      selected_option_ids: selectedOptionIds,
      fabric_color: fabricColor,
      print_color: printColor,
      top_color: topColor,
      bottom_color: bottomColor,
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ id: itemId, quantity });
  };

  const removeItem = (itemId: number) => removeMutation.mutate(itemId);

  const totalItems = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const itemCount = cart?.items.length ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        itemCount,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
