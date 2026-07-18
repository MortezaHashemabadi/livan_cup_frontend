"use client";
import Link from "next/link";
import {
  Package,
  Wand2,
  Building2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/StatCard";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/hooks/use-orders";
import { useDesigns } from "@/lib/hooks/use-designs";
import { useAddresses } from "@/lib/hooks/use-addresses";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: designs = [], isLoading: designsLoading } = useDesigns();
  const { data: addresses = [] } = useAddresses();

  const activeOrders = orders.filter((o) =>
    ["pending", "paid", "processing", "shipped"].includes(o.status),
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const firstName = user?.first_name || "کاربر";

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">
          سلام، {firstName} 👋
        </h1>
        <p className="text-muted-foreground">خلاصه‌ای از وضعیت حساب شما.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="سفارش‌های فعال"
          value={ordersLoading ? "—" : activeOrders.length}
          icon={Package}
          color="bg-soft-blue text-cobalt"
          delay={0.05}
        />
        <StatCard
          label="تکمیل‌شده"
          value={ordersLoading ? "—" : completedOrders.length}
          icon={CheckCircle}
          color="bg-pale-mint text-emerald-700"
          delay={0.1}
        />
        <StatCard
          label="طرح‌های ذخیره‌شده"
          value={designsLoading ? "—" : designs.length}
          icon={Wand2}
          color="bg-soft-peach text-orange-700"
          delay={0.15}
        />
        <StatCard
          label="آدرس‌ها"
          value={addresses.length}
          icon={Building2}
          color="bg-secondary text-muted-foreground"
          delay={0.2}
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">
          دسترسی سریع
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/designer">
            <Button className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-10 px-5 font-medium text-sm shadow-none gap-2">
              <Sparkles className="w-4 h-4" />
              طرح جدید
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              className="rounded-full h-10 px-5 font-medium text-sm gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              سفارش جدید
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button
              variant="outline"
              className="rounded-full h-10 px-5 font-medium text-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              افزودن آدرس
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-base">سفارش‌های اخیر</h2>
            <Link
              href="/dashboard/orders"
              className="text-xs text-cobalt font-medium hover:opacity-80 flex items-center gap-1"
            >
              مشاهده همه <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-2xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">سفارشی ثبت نشده</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 4).map((order) => (
                <Link
                  key={order.id}
                  href="/dashboard/orders"
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-secondary/50 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium group-hover:text-cobalt transition-colors">
                      سفارش #{order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {parseFloat(order.total).toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-base">
              طرح‌های ذخیره‌شده
            </h2>
            <Link
              href="/dashboard/designs"
              className="text-xs text-cobalt font-medium hover:opacity-80 flex items-center gap-1"
            >
              مشاهده همه <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {designsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-8">
              <Wand2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                هنوز طرحی ذخیره نشده
              </p>
              <Link
                href="/designer"
                className="text-xs text-cobalt font-medium mt-1 inline-block"
              >
                بساز →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {designs.slice(0, 6).map((design) => (
                <Link
                  key={design.id}
                  href="/dashboard/designs"
                  className="group rounded-2xl overflow-hidden border border-border/40 aspect-square bg-cream"
                >
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail ?? undefined}
                      alt={design.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-muted-foreground/25" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
