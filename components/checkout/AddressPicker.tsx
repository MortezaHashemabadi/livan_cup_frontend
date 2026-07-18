"use client";
import { useState } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddresses, useCreateAddress } from "@/lib/hooks/use-addresses";
import { toast } from "sonner";
import type { Address } from "@/lib/api/types";

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function AddressPicker({ selectedId, onSelect }: Props) {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    province: "",
    city: "",
    full_address: "",
    postal_code: "",
  });

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.province || !form.city || !form.full_address) {
      toast.error("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }
    try {
      const created = await createAddress.mutateAsync({
        ...form,
        is_default: addresses.length === 0,
      } as Omit<Address, "id">);
      onSelect(created.id);
      setShowForm(false);
      setForm({
        title: "",
        province: "",
        city: "",
        full_address: "",
        postal_code: "",
      });
      toast.success("آدرس ذخیره شد");
    } catch {
      toast.error("ذخیره‌ی آدرس ناموفق بود");
    }
  };

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground">
        در حال بارگذاری آدرس‌ها...
      </p>
    );

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`text-right p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedId === addr.id
                  ? "border-cobalt bg-cobalt/5"
                  : "border-border/50 bg-white hover:border-cobalt/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1">{addr.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {addr.full_address}، {addr.city}
                    </span>
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedId === addr.id ? "border-cobalt bg-cobalt" : "border-border"}`}
                >
                  {selectedId === addr.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          افزودن آدرس جدید
        </button>
      ) : (
        <div className="bg-secondary/40 rounded-2xl p-5 space-y-3">
          <Input
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            placeholder="عنوان (مثلاً دفتر مرکزی)"
            className="rounded-xl h-11 bg-white"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              value={form.province}
              onChange={(e) => updateForm("province", e.target.value)}
              placeholder="استان"
              className="rounded-xl h-11 bg-white"
            />
            <Input
              value={form.city}
              onChange={(e) => updateForm("city", e.target.value)}
              placeholder="شهر"
              className="rounded-xl h-11 bg-white"
            />
          </div>
          <Input
            value={form.full_address}
            onChange={(e) => updateForm("full_address", e.target.value)}
            placeholder="آدرس کامل"
            className="rounded-xl h-11 bg-white"
          />
          <Input
            value={form.postal_code}
            onChange={(e) => updateForm("postal_code", e.target.value)}
            placeholder="کد پستی"
            className="rounded-xl h-11 bg-white"
          />
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSubmit}
              disabled={createAddress.isPending}
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 text-sm"
            >
              ذخیره آدرس
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="rounded-full h-10 text-sm"
            >
              انصراف
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
