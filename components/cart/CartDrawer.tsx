"use client";
import LazyImage from "@/components/ui/lazy-image";
import Link from "next/link";
import { X, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { getVariantImage } from "@/lib/api/endpoints/catalog";
import { formatItemSpecs } from "@/lib/cart-format";
import QuantityInput from "@/components/products/QuantityInput";
import { motion, AnimatePresence } from "framer-motion";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();
  const items = cart?.items ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-heading font-bold text-lg">سبد خرید</h2>
                <span className="text-sm text-muted-foreground">
                  ({items.length})
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">
                    سبد خرید شما خالی است
                  </p>
                  <p className="text-sm text-muted-foreground/60 mb-8">
                    محصولات را مشاهده و سفارش دهید
                  </p>
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="rounded-full">
                      مشاهده محصولات
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const image = getVariantImage(item.variant_detail);
                    const specs = formatItemSpecs(item);
                    const min = item.min_quantity ?? 1;
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-2xl bg-cream overflow-hidden flex-shrink-0">
                          {image ? (
                            <LazyImage
                              src={`${NEXT_PUBLIC_MEDIA_URL}${image}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                            {item.variant_detail.attribute_values
                              .map((av) => av.value)
                              .join(" · ")}
                          </p>
                          {specs.length > 0 && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              {specs.join(" · ")}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.unit_price !== null
                              ? `${item.unit_price.toLocaleString("fa-IR")} تومان هر عدد`
                              : "—"}
                          </p>
                          <div className="mt-3">
                            <QuantityInput
                              size="sm"
                              value={item.quantity}
                              min={min}
                              step={min >= 50 ? 50 : 1}
                              onChange={(q) => updateQuantity(item.id, q)}
                            />
                          </div>
                          {item.error && (
                            <p className="text-xs text-destructive mt-2">
                              {item.error}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-sm">
                            {item.subtotal !== null
                              ? `${item.subtotal.toLocaleString("fa-IR")} تومان`
                              : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && cart && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>جمع جزء</span>
                  <span>{cart.subtotal.toLocaleString("fa-IR")} تومان</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-sm text-cobalt">
                    <span>تخفیف ({cart.discount_code})</span>
                    <span>
                      -{cart.discount_amount.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-medium">مجموع</span>
                  <span className="font-heading font-bold text-xl">
                    {cart.total.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                {cart.can_checkout === false ? (
                  <Button
                    disabled
                    className="w-full bg-cobalt text-white rounded-full h-12 font-medium"
                  >
                    ابتدا مشکل آیتم‌های سبد را برطرف کنید
                  </Button>
                ) : (
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-12 font-medium">
                      ادامه‌ی فرآیند خرید
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
