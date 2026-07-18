import type { OrderStatus } from "@/lib/api/endpoints/orders";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "در انتظار بررسی",
      className: "bg-soft-peach/60 text-orange-700",
    },
    paid: { label: "پرداخت‌شده", className: "bg-soft-blue/60 text-cobalt" },
    processing: {
      label: "در حال تولید",
      className: "bg-soft-blue/60 text-cobalt",
    },
    shipped: {
      label: "ارسال‌شده",
      className: "bg-pale-mint/60 text-emerald-700",
    },
    delivered: {
      label: "تحویل‌شده",
      className: "bg-secondary text-muted-foreground",
    },
    cancelled: {
      label: "لغو‌شده",
      className: "bg-destructive/10 text-destructive",
    },
  };

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
