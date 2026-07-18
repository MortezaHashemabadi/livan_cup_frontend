"use client";
import { useState, useEffect } from "react";
import { Building2, Plus, MapPin, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
} from "@/lib/hooks/use-business-profile";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/lib/hooks/use-addresses";
import AddressCard from "@/components/dashboard/AddressCard";
import type { Address } from "@/lib/api/types";

const bizTypes = [
  { value: "cafe", label: "کافه" },
  { value: "restaurant", label: "رستوران" },
  { value: "hotel", label: "هتل" },
  { value: "retail", label: "خرده‌فروشی" },
  { value: "office", label: "دفتر" },
  { value: "other", label: "سایر" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const emptyAddress = {
  title: "",
  province: "",
  city: "",
  full_address: "",
  postal_code: "",
  is_default: false,
};

export default function DashboardProfile() {
  const { user } = useAuth();
  const { data: bizProfile, isLoading: bizLoading } = useBusinessProfile();
  const updateBizProfile = useUpdateBusinessProfile();
  const { data: addresses = [], isLoading: addrLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [editingBiz, setEditingBiz] = useState(false);
  const [bizForm, setBizForm] = useState({
    business_name: "",
    business_type: "cafe",
    economic_code: "",
    national_id: "",
    position: "",
  });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<number | null>(null);
  const [addrForm, setAddrForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bizProfile) {
      setBizForm({
        business_name: bizProfile.business_name || "",
        business_type: bizProfile.business_type || "cafe",
        economic_code: bizProfile.economic_code || "",
        national_id: bizProfile.national_id || "",
        position: bizProfile.position || "",
      });
    }
  }, [bizProfile]);

  const saveBiz = async () => {
    setSaving(true);
    try {
      await updateBizProfile.mutateAsync(bizForm);
      setEditingBiz(false);
      toast.success("اطلاعات کسب‌وکار ذخیره شد");
    } catch {
      toast.error("ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  };

  const openAddrForm = (addr: Address | null = null) => {
    setEditingAddrId(addr?.id ?? null);
    setAddrForm(
      addr
        ? {
            title: addr.title,
            province: addr.province,
            city: addr.city,
            full_address: addr.full_address,
            postal_code: addr.postal_code,
            is_default: addr.is_default,
          }
        : emptyAddress,
    );
    setShowAddrForm(true);
  };

  const saveAddr = async () => {
    if (!addrForm.province || !addrForm.city || !addrForm.full_address) {
      toast.error("فیلدهای ضروری را پر کنید");
      return;
    }
    setSaving(true);
    try {
      if (editingAddrId) {
        await updateAddress.mutateAsync({
          id: editingAddrId,
          payload: addrForm,
        });
        toast.success("آدرس بروزرسانی شد");
      } else {
        await createAddress.mutateAsync(addrForm);
        toast.success("آدرس افزوده شد");
      }
      setShowAddrForm(false);
    } catch {
      toast.error("ذخیره‌ی آدرس ناموفق بود");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddr = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("آدرس حذف شد");
    } catch {
      toast.error("حذف ناموفق بود");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">
          پروفایل کسب‌وکار
        </h1>
        <p className="text-muted-foreground text-sm">
          اطلاعات کسب‌وکار و آدرس‌های خود را مدیریت کنید.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            اطلاعات کسب‌وکار
          </h2>
          {!editingBiz && (
            <button
              onClick={() => setEditingBiz(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-cobalt hover:opacity-80 transition-opacity"
            >
              <Pencil className="w-3.5 h-3.5" />
              ویرایش
            </button>
          )}
        </div>

        {bizLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 rounded-2xl" />
            ))}
          </div>
        ) : editingBiz ? (
          <div className="space-y-5">
            <Field label="نام کسب‌وکار">
              <Input
                value={bizForm.business_name}
                onChange={(e) =>
                  setBizForm((p) => ({ ...p, business_name: e.target.value }))
                }
                placeholder="کافه نمونه"
                className="rounded-2xl h-12"
              />
            </Field>
            <Field label="سمت شما">
              <Input
                value={bizForm.position}
                onChange={(e) =>
                  setBizForm((p) => ({ ...p, position: e.target.value }))
                }
                placeholder="مدیر، صاحب کسب‌وکار و..."
                className="rounded-2xl h-12"
              />
            </Field>
            <Field label="نوع کسب‌وکار">
              <div className="flex flex-wrap gap-2">
                {bizTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() =>
                      setBizForm((p) => ({ ...p, business_type: t.value }))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${bizForm.business_type === t.value ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:bg-secondary/70"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="کد اقتصادی">
                <Input
                  value={bizForm.economic_code}
                  onChange={(e) =>
                    setBizForm((p) => ({ ...p, economic_code: e.target.value }))
                  }
                  className="rounded-2xl h-11"
                  dir="ltr"
                />
              </Field>
              <Field label="شناسه ملی">
                <Input
                  value={bizForm.national_id}
                  onChange={(e) =>
                    setBizForm((p) => ({ ...p, national_id: e.target.value }))
                  }
                  className="rounded-2xl h-11"
                  dir="ltr"
                />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveBiz}
                disabled={saving || !bizForm.business_name.trim()}
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-6 shadow-none text-sm"
              >
                {saving ? "در حال ذخیره…" : "ذخیره تغییرات"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingBiz(false)}
                className="rounded-full h-10 px-5 text-sm"
              >
                انصراف
              </Button>
            </div>
          </div>
        ) : bizProfile?.business_name ? (
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <p className="text-xs text-muted-foreground mb-1">نام کسب‌وکار</p>
              <p className="font-semibold">{bizProfile.business_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">نوع</p>
              <p className="font-semibold">
                {bizTypes.find((t) => t.value === bizProfile.business_type)
                  ?.label || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">سمت</p>
              <p className="font-semibold">{bizProfile.position || "—"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              هنوز اطلاعاتی ثبت نشده
            </p>
            <Button
              onClick={() => setEditingBiz(true)}
              variant="outline"
              className="rounded-full h-10 px-5 text-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              افزودن اطلاعات
            </Button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            آدرس‌ها
          </h2>
          {!showAddrForm && (
            <button
              onClick={() => openAddrForm()}
              className="flex items-center gap-1.5 text-xs font-medium text-cobalt hover:opacity-80 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              افزودن آدرس
            </button>
          )}
        </div>

        <AnimatePresence>
          {showAddrForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-3xl border border-cobalt/20 p-6 space-y-4">
                <p className="font-heading font-semibold text-sm">
                  {editingAddrId ? "ویرایش آدرس" : "آدرس جدید"}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="عنوان">
                    <Input
                      value={addrForm.title}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="دفتر مرکزی"
                      className="rounded-2xl h-11"
                    />
                  </Field>
                  <Field label="کد پستی">
                    <Input
                      value={addrForm.postal_code}
                      onChange={(e) =>
                        setAddrForm((p) => ({
                          ...p,
                          postal_code: e.target.value,
                        }))
                      }
                      className="rounded-2xl h-11"
                      dir="ltr"
                    />
                  </Field>
                  <Field label="استان">
                    <Input
                      value={addrForm.province}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, province: e.target.value }))
                      }
                      className="rounded-2xl h-11"
                    />
                  </Field>
                  <Field label="شهر">
                    <Input
                      value={addrForm.city}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, city: e.target.value }))
                      }
                      className="rounded-2xl h-11"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="آدرس کامل">
                      <Input
                        value={addrForm.full_address}
                        onChange={(e) =>
                          setAddrForm((p) => ({
                            ...p,
                            full_address: e.target.value,
                          }))
                        }
                        className="rounded-2xl h-11"
                      />
                    </Field>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    onClick={saveAddr}
                    disabled={saving}
                    className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-6 shadow-none text-sm"
                  >
                    {saving
                      ? "در حال ذخیره…"
                      : editingAddrId
                        ? "بروزرسانی"
                        : "افزودن آدرس"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddrForm(false)}
                    className="rounded-full h-10 px-5 text-sm"
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {addrLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-3xl" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/50 p-10 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              هنوز آدرسی اضافه نشده
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={openAddrForm}
                onDelete={handleDeleteAddr}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
