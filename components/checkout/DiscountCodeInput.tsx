"use client";
import { useState } from "react";
import { Tag, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { cartApi, type Cart } from "@/lib/api/endpoints/cart";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/types";

export default function DiscountCodeInput({ cart }: { cart: Cart }) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await cartApi.applyDiscount(code.trim());
      invalidate();
      toast.success("کد تخفیف اعمال شد");
      setCode("");
    } catch (err) {
      const e = err as ApiError;
      const payload = e.payload as any;
      toast.error(payload?.detail || "کد تخفیف نامعتبر است");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await cartApi.removeDiscount();
      invalidate();
      toast.success("کد تخفیف حذف شد");
    } catch {
      toast.error("حذف کد تخفیف ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  if (cart.discount_code) {
    return (
      <div className="flex items-center justify-between bg-pale-mint rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          کد «{cart.discount_code}» اعمال شد
        </div>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="کد تخفیف"
          className="rounded-2xl h-11 pr-10 bg-white"
        />
      </div>
      <Button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        variant="outline"
        className="rounded-2xl h-11 px-5 text-sm"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "اعمال"}
      </Button>
    </div>
  );
}
