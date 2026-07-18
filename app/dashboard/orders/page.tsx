"use client";
import { useState } from "react";
import { Package, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import { useOrders } from "@/lib/hooks/use-orders";
import { getVariantImage } from "@/lib/api/endpoints/catalog";
import type { OrderStatus } from "@/lib/api/endpoints/orders";
import { RotateCcw, Loader2 } from "lucide-react";
import { useReorder } from "@/lib/hooks/use-reorder";

const NEXT_PUBLIC_MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:8000";

const statusFilters: { id: "all" | "active" | OrderStatus; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "active", label: "در جریان" },
  { id: "processing", label: "در حال تولید" },
  { id: "shipped", label: "ارسال‌شده" },
  { id: "delivered", label: "تحویل‌شده" },
];

export default function DashboardOrders() {
  const [filter, setFilter] = useState<"all" | "active" | OrderStatus>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { reorder, loadingOrderId } = useReorder();
  const { data: orders = [], isLoading } = useOrders();

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["pending", "paid", "processing", "shipped"].includes(o.status);
    return o.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">
          سفارش‌ها
        </h1>
        <p className="text-muted-foreground text-sm">
          پیگیری و مدیریت سفارش‌های تولید شما.
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === f.id
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/50 p-16 text-center">
          <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">سفارشی پیدا نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-white rounded-3xl border border-border/50 overflow-hidden"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setExpanded(expanded === order.id ? null : order.id);
                }}
                className="w-full flex items-center justify-between p-5 text-right hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-soft-blue/40 flex items-center justify-center">
                    <Package className="w-4 h-4 text-cobalt" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">سفارش #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {parseFloat(order.total).toLocaleString("fa-IR")} تومان
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reorder(order);
                    }}
                    disabled={loadingOrderId === order.id}
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-cobalt"
                    title="سفارش مجدد"
                  >
                    {loadingOrderId === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                  </button>
                  <OrderStatusBadge status={order.status} />
                  {expanded === order.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
                      {order.items.map((item) => {
                        const image = getVariantImage(item.variant_detail);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            {image ? (
                              <img
                                src={`${NEXT_PUBLIC_MEDIA_URL}${image}`}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover bg-cream"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                                <Package className="w-4 h-4 text-muted-foreground/40" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity.toLocaleString("fa-IR")} عدد ·{" "}
                                {parseFloat(item.unit_price).toLocaleString(
                                  "fa-IR",
                                )}{" "}
                                تومان/عدد
                              </p>
                            </div>
                            <p className="text-sm font-semibold">
                              {parseFloat(item.subtotal).toLocaleString(
                                "fa-IR",
                              )}{" "}
                              تومان
                            </p>
                          </div>
                        );
                      })}
                      <div className="border-t border-border/40 pt-3 space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">جمع جزء</span>
                          <span>
                            {parseFloat(order.subtotal).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                        {order.discount_code && (
                          <div className="flex justify-between text-sm text-cobalt">
                            <span>
                              تخفیف ({order.discount_code}
                              {order.discount_percent !== null &&
                                ` · ${order.discount_percent}٪`}
                              )
                            </span>
                            <span>
                              -
                              {parseFloat(order.discount_amount).toLocaleString(
                                "fa-IR",
                              )}{" "}
                              تومان
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-semibold pt-1">
                          <span>مجموع</span>
                          <span>
                            {parseFloat(order.total).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                      </div>
                      {order.address_snapshot && (
                        <div className="flex items-start gap-2 pt-2 border-t border-border/40">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            {order.address_snapshot}
                          </p>
                        </div>
                      )}
                      {order.notes && (
                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs font-medium mb-1">
                            یادداشت تولید
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
