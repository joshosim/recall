"use client";

import Link from "next/link";
import HeatRing from "./HeatRing";
import StatusBadge from "./StatusBadge";
import { daysSince, getStatus } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface CustomerCardProps {
  customer: Customer;
  selected?: boolean;
  onClick?: (customer: Customer) => void;
}

export default function CustomerCard({
  customer,
  selected = false,
  onClick,
}: CustomerCardProps) {
  const days = daysSince(customer.last_order_date);
  const status = getStatus(days);
  const isDue = status === "due";

  const cardContent = (
    <div
      onClick={() => onClick?.(customer)}
      className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-200 cursor-pointer group
        ${selected
          ? "bg-[#1A2A45] border-emerald-500/20"
          : "bg-[#131E35] border-[#1E2B45] hover:border-[#2A3B5A] hover:bg-[#16223A]"
        }`}
    >
      {/* Due indicator strip */}
      {isDue && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-red-500" />
      )}

      <HeatRing lastOrderDate={customer.last_order_date} size={48} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-[#F7F4EF] text-sm truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {customer.name}
          </span>
          <StatusBadge lastOrderDate={customer.last_order_date} />
        </div>
        <p className="text-xs text-[#8B96B0] truncate">
          {customer.note || customer.phone}
        </p>
      </div>

      <svg
        className="text-[#2A3B5A] group-hover:text-[#4A5568] transition-colors flex-shrink-0"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>
  );

  // If onClick is passed, render as div (used in dashboard with side panel)
  // Otherwise wrap in Link for standalone navigation
  if (onClick) return cardContent;

  return (
    <Link href={`/customers/${customer.id}`} className="block no-underline">
      {cardContent}
    </Link>
  );
}
