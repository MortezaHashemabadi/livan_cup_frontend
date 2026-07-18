"use client";
import Link from "next/link";
import { Wand2, Sparkles, Copy, ShoppingBag, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useDesigns,
  useDeleteDesign,
  useDuplicateDesign,
} from "@/lib/hooks/use-designs";


export default function DashboardDesigns() {
  const { data: designs = [], isLoading } = useDesigns();
  
  const deleteDesign = useDeleteDesign();
  const duplicateDesign = useDuplicateDesign();

  const handleDuplicate = async (design: (typeof designs)[number]) => {
    try {
      await duplicateDesign.mutateAsync(design);
      toast.success("طرح کپی شد");
    } catch {
      toast.error("کپی کردن طرح ناموفق بود");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDesign.mutateAsync(id);
      toast.success("طرح حذف شد");
    } catch {
      toast.error("حذف طرح ناموفق بود");
    }
  };
  console.log(designs);
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">
            طرح‌های ذخیره‌شده
          </h1>
          <p className="text-muted-foreground text-sm">
            طرح‌های ساخته‌شده‌ی شما.
          </p>
        </div>
        <Link href="/designer">
          <Button className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-10 px-5 font-medium text-sm shadow-none gap-2">
            <Plus className="w-4 h-4" />
            طرح جدید
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-3xl" />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/50 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-7 h-7 text-muted-foreground/30" />
          </div>
          <p className="font-heading font-semibold text-muted-foreground mb-2">
            هنوز طرحی ذخیره نشده
          </p>
          <p className="text-sm text-muted-foreground/60 mb-6">
            اولین طرح خود را با هوش مصنوعی بسازید
          </p>
          <Link href="/designer">
            <Button className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-10 px-6 shadow-none gap-2">
              <Sparkles className="w-4 h-4" />
              شروع طراحی
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {designs.map((design, i) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group bg-white rounded-3xl border border-border/50 overflow-hidden"
            >
              <div className="relative aspect-square bg-cream overflow-hidden">
                {design.thumbnail ? (
                  <img
                    src={design.thumbnail ?? undefined}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="font-medium text-sm truncate mb-3">
                  {design.name || "طرح بدون عنوان"}
                </p>
                <div className="flex gap-2">
                  <Link href="/products" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full text-xs h-8 shadow-none gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      سفارش
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDuplicate(design)}
                    disabled={duplicateDesign.isPending}
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                    title="کپی"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    disabled={deleteDesign.isPending}
                    className="p-2 rounded-full hover:bg-destructive/8 hover:text-destructive transition-colors text-muted-foreground"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
