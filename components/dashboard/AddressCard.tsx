"use client";
import { MapPin, Pencil, Trash2, Star } from "lucide-react";
import type { Address } from "@/lib/api/types";

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-border/50 p-5 flex gap-4">
      <div className="w-10 h-10 rounded-2xl bg-soft-blue/30 flex items-center justify-center flex-shrink-0">
        <MapPin className="w-4 h-4 text-cobalt" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">
              {address.title || "بدون عنوان"}
            </p>
            {address.is_default && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-cobalt/10 text-cobalt">
                <Star className="w-2.5 h-2.5" />
                پیش‌فرض
              </span>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(address)}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(address.id)}
              className="p-1.5 rounded-full hover:bg-destructive/8 hover:text-destructive transition-colors text-muted-foreground"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {address.full_address}، {address.city}، {address.province}
        </p>
        {address.postal_code && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            کد پستی: {address.postal_code}
          </p>
        )}
      </div>
    </div>
  );
}
