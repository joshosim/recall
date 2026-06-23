"use client";

import { useEffect } from "react";
import DetailPanel from "./DetailPanel";
import type { Customer } from "@/types/customer";

interface BottomSheetProps {
  customer: Customer | null;
  onClose: () => void;
  onMarkOrdered?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BottomSheet({
  customer,
  onClose,
  onMarkOrdered,
  onDelete,
}: BottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (customer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [customer]);

  if (!customer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-[#0F1729] rounded-t-3xl border border-[#1E2B45] border-b-0 p-6 max-h-[90vh] overflow-y-auto"
        style={{ animation: "slideUp 0.25s ease" }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#1E2B45] rounded-full mx-auto mb-6" />
        <DetailPanel
          customer={customer}
          onClose={onClose}
          onMarkOrdered={onMarkOrdered}
          onDelete={onDelete}
        />
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
