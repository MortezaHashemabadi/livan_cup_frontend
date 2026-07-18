"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
  Truck,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { checkoutApi } from "@/lib/api/endpoints/cart";
import { getVariantImage } from "@/lib/api/endpoints/catalog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AddressPicker from "@/components/checkout/AddressPicker";
import DiscountCodeInput from "@/components/checkout/DiscountCodeInput";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ticketsApi } from "@/lib/api/endpoints/tickets";
import { useAuth } from "@/lib/auth-context";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

const steps = [
  { id: 1, label: "ارسال", icon: Truck },
  { id: 2, label: "تولید", icon: Package },
  { id: 3, label: "پرداخت", icon: CreditCard },
];

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const items = cart?.items ?? [];
  const { user } = useAuth();
  const isReorder = searchParams.get("reorder") === "1";
  const [step, setStep] = useState(() => {
    if (!isReorder) return 1;
    return Number(sessionStorage.getItem("reorder_step")) || 1;
  });
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    () => {
      if (!isReorder) return null;
      const stored = sessionStorage.getItem("reorder_address_id");
      return stored ? Number(stored) : null;
    },
  );
  const [notes, setNotes] = useState(() =>
    isReorder ? sessionStorage.getItem("reorder_notes") || "" : "",
  );

  useEffect(() => {
    if (isReorder) {
      sessionStorage.removeItem("reorder_address_id");
      sessionStorage.removeItem("reorder_step");
      sessionStorage.removeItem("reorder_notes");
    }
  }, [isReorder]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleNext = () => {
    if (step === 1 && !selectedAddressId) {
      toast.error("یک آدرس انتخاب کنید");
      return;
    }
    setStep((s) => s + 1);
  };

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      toast.error("یک آدرس انتخاب کنید");
      return;
    }
    setIsSubmitting(true);
    try {
      await checkoutApi.checkout(selectedAddressId, notes);
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      if (sessionStorage.getItem("needs_design_consultation") === "1") {
        sessionStorage.removeItem("needs_design_consultation");
        try {
          await ticketsApi.create({
            fullname:
              `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
              user?.phone ||
              "",
            phone: user?.phone || "",
            ticket_type: "design",
            subject: "درخواست مشاوره طراحی",
            message: notes
              ? `کاربر درخواست مشاوره طراحی دارد.\n\nیادداشت: ${notes}`
              : "کاربر درخواست مشاوره طراحی دارد.",
          });
        } catch {}
      }

      setOrderComplete(true);
      toast.success("سفارش با موفقیت ثبت شد!");
    } catch {
      toast.error("ثبت سفارش ناموفق بود");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-12 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <div className="w-20 h-20 rounded-full bg-pale-mint flex items-center justify-center mb-6 mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>
        <h2 className="font-display font-bold text-3xl mb-2">
          سفارش به تولید ارسال شد!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          سفارش شما در وضعیت «در انتظار بررسی» است. تیم ما به‌زودی برای تایید
          نهایی با شما تماس می‌گیرد.
        </p>
        <Link href="/">
          <Button className="h-12 px-8 font-medium rounded-full bg-cobalt hover:bg-cobalt-hover text-white">
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-12 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">
          سبد خرید خالی است
        </h2>
        <p className="text-muted-foreground mb-8">
          برای شروع محصولاتی اضافه کنید
        </p>
        <Link href="/products">
          <Button className="rounded-full bg-cobalt hover:bg-cobalt-hover text-white">
            مشاهده محصولات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 "
        >
          <ArrowRight className="w-4 h-4" />
          ادامه خرید
        </Link>

        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-10">
          تسویه‌حساب
        </h1>

        <div className="flex items-center justify-between mb-12 w-full gap-4">
          {steps.map((s, i) => (
            <>
              <div
                key={s.id}
                className={`flex items-center justify-center gap-2 px-6 h-12 rounded-full text-sm font-medium transition-colors flex-1 ${
                  step >= s.id
                    ? "bg-cobalt text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-0.5 w-16 bg-border rounded-full flex-shrink-0 hidden md:block" />
              )}
            </>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AddressPicker
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-cream rounded-3xl p-6">
              <h3 className="font-heading font-semibold mb-4">خلاصه سفارش</h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const image = getVariantImage(item.variant_detail);
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        {image && (
                          <img
                            src={`${NEXT_PUBLIC_MEDIA_URL}${image}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity.toLocaleString("fa-IR")} عدد ×{" "}
                          {item.unit_price?.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {item.subtotal?.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                یادداشت تولید (اختیاری)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl min-h-[80px] bg-white"
                placeholder="هر گونه نیاز خاص برای تولید..."
              />
            </div>
          </motion.div>
        )}

        {step === 3 && cart && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-cream rounded-3xl p-6">
              <div className="mb-5">
                <DiscountCodeInput cart={cart} />
              </div>
              <div className="space-y-2 mb-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>جمع جزء</span>
                  <span>{cart.subtotal.toLocaleString("fa-IR")} تومان</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-cobalt">
                    <span>تخفیف ({cart.discount_code})</span>
                    <span>
                      -{cart.discount_amount.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="font-medium">محاسبه پس از تایید</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-heading font-bold">مجموع</span>
                  <span className="font-heading font-bold text-xl">
                    {cart.total.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                با ثبت این سفارش، شرایط ما را می‌پذیرید. تیم ما برای تایید
                جزئیات تولید و پرداخت با شما تماس خواهد گرفت.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="rounded-full gap-2 h-12 px-8 font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              قبلی
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full gap-2 shadow-none h-12 px-8 font-medium"
            >
              ادامه
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full gap-2 h-12 px-8 font-medium shadow-none"
            >
              <Package className="w-4 h-4" />
              {isSubmitting ? "در حال ثبت..." : "ارسال به تولید"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
