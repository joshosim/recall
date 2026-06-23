"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddCustomerModalProps {
  onClose: () => void;
}

export default function AddCustomerModal({ onClose }: AddCustomerModalProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          note: form.note.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      router.refresh();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.name.trim() && form.phone.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#131E35] rounded-t-3xl border border-[#1E2B45] border-b-0 p-6"
        style={{ animation: "slideUp 0.25s ease" }}
      >
        <div className="w-10 h-1 bg-[#1E2B45] rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold text-[#F7F4EF]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            New Customer
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1E2B45] text-[#8B96B0] hover:text-[#F7F4EF] transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {[
            { key: "name", label: "Full Name", placeholder: "e.g. Chinyere Okafor", type: "text" },
            { key: "phone", label: "Phone Number", placeholder: "e.g. 08012345678", type: "tel" },
            { key: "note", label: "Note (optional)", placeholder: "e.g. Prefers WhatsApp, bulk buyer…", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8B96B0] mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-[#0F1729] border border-[#1E2B45] focus:border-[#00E5A0] rounded-xl px-4 py-3 text-[#F7F4EF] text-sm outline-none transition-colors placeholder:text-[#2A3B5A]"
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className={`w-full rounded-xl py-4 font-bold text-base transition-all mt-2 ${
              isValid
                ? "bg-[#00E5A0] hover:bg-[#00C988] text-[#0F1729]"
                : "bg-[#1E2B45] text-[#4A5568] cursor-not-allowed"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {saving ? "Saving…" : "Save Customer"}
          </button>
        </div>
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
