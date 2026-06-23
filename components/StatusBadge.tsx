import { daysSince, getStatus, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

interface StatusBadgeProps {
  lastOrderDate: string;
}

export default function StatusBadge({ lastOrderDate }: StatusBadgeProps) {
  const days = daysSince(lastOrderDate);
  const status = getStatus(days);
  const { bg, text } = STATUS_COLORS[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${bg} ${text}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
