import type { CustomerStatus } from "@/types/customer";

export function daysSince(dateStr: string): number {
    const last = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStatus(days: number): CustomerStatus {
    if (days > 30) return "due";
    if (days > 14) return "warning";
    return "active";
}

export const STATUS_COLORS: Record<CustomerStatus, { bg: string; text: string; ring: string }> = {
    active: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "#00E5A0" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "#FFB547" },
    due: { bg: "bg-red-500/10", text: "text-red-400", ring: "#FF5252" },
};

export const STATUS_LABELS: Record<CustomerStatus, string> = {
    active: "Active",
    warning: "Soon",
    due: "Due",
};

export function formatPhone(phone: string): string {
    // Normalize to +234 format for WhatsApp
    return phone.replace(/^0/, "234");
}

export function buildWhatsAppLink(phone: string, firstName: string): string {
    const normalized = formatPhone(phone);
    const message = encodeURIComponent(`Hi ${firstName}! Just checking in 👋`);
    return `https://wa.me/${normalized}?text=${message}`;
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
