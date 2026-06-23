"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeatRing from "./HeatRing";
import StatusBadge from "./StatusBadge";
import { daysSince, buildWhatsAppLink, formatDate } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface DetailPanelProps {
  customer: Customer;
  onClose?: () => void;
  onMarkOrdered?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DetailPanel({
  customer,
  onClose,
  onMarkOrdered,
  onDelete,
}: DetailPanelProps) {
  const router = useRouter();
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const days = daysSince(customer.last_order_date);
  const firstName = customer.name.split(" ")[0];
  const waLink = buildWhatsAppLink(customer.phone, firstName);

  const handleMarkOrdered = async () => {
    setMarking(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          last_order_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      onMarkOrdered?.(customer.id);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      onDelete?.(customer.id);
      onClose?.();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-[#F7F4EF] mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {customer.name}
          </h2>
          <p className="text-sm text-[#8B96B0]">{customer.phone}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1E2B45] text-[#8B96B0] hover:text-[#F7F4EF] transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Heat ring stat */}
      <div className="bg-[#0F1729] rounded-2xl p-5 mb-4 text-center">
        <div className="flex justify-center mb-3">
          <HeatRing lastOrderDate={customer.last_order_date} size={80} strokeWidth={5} />
        </div>
        <div
          className="text-4xl font-black mb-1"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: days > 30 ? "#FF5252" : days > 14 ? "#FFB547" : "#00E5A0",
          }}
        >
          {days}
        </div>
        <p className="text-xs text-[#8B96B0] mb-3">days since last order</p>
        <StatusBadge lastOrderDate={customer.last_order_date} />
      </div>

      {/* Meta */}
      <div className="bg-[#0F1729] rounded-xl p-4 mb-4 space-y-2">
        {customer.note && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4A5568] mb-1">Note</p>
            <p className="text-sm text-[#8B96B0] leading-relaxed">{customer.note}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4A5568] mb-1">Last Order</p>
          <p className="text-sm text-[#8B96B0]">{formatDate(customer.last_order_date)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4A5568] mb-1">Customer Since</p>
          <p className="text-sm text-[#8B96B0]">{formatDate(customer.created_at)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 mt-auto">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#00E5A0] hover:bg-[#00C988] text-[#0F1729] font-bold rounded-xl py-3.5 transition-colors no-underline"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Open WhatsApp
        </a>

        <button
          onClick={handleMarkOrdered}
          disabled={marking}
          className="w-full bg-[#1E2B45] hover:bg-[#253550] border border-[#2A3B5A] text-[#F7F4EF] font-semibold rounded-xl py-3 transition-colors disabled:opacity-50"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14 }}
        >
          {marking ? "Saving…" : "✓ Mark as Ordered Today"}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`w-full font-semibold rounded-xl py-3 transition-colors text-sm ${
            confirmDelete
              ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
              : "bg-transparent text-[#4A5568] hover:text-red-400"
          }`}
        >
          {deleting ? "Deleting…" : confirmDelete ? "Tap again to confirm delete" : "Delete customer"}
        </button>
      </div>
    </div>
  );
}
