"use client";

import { daysSince, getStatus, STATUS_COLORS } from "@/lib/utils";

interface HeatRingProps {
  lastOrderDate: string;
  size?: number;
  strokeWidth?: number;
  showDays?: boolean;
}

export default function HeatRing({
  lastOrderDate,
  size = 48,
  strokeWidth = 4,
  showDays = true,
}: HeatRingProps) {
  const days = daysSince(lastOrderDate);
  const status = getStatus(days);
  const color = STATUS_COLORS[status].ring;

  const maxDays = 60;
  const clampedDays = Math.min(days, maxDays);
  const r = size / 2 - strokeWidth - 1;
  const circ = 2 * Math.PI * r;
  const filled = (clampedDays / maxDays) * circ;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1E2B45"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>

      {showDays && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: size < 56 ? 9 : 11, fontWeight: 700, color: "#8B96B0", letterSpacing: "-0.02em" }}
        >
          {days > 99 ? "99+" : `${days}d`}
        </div>
      )}
    </div>
  );
}
