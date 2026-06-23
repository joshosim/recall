"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = form.name.trim() && form.phone.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
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

      router.push("/");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-[#1E2B45]">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#131E35] text-[#8B96B0] hover:text-[#F7F4EF] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold font-display text-[#F7F4EF]">New Customer</h1>
      </header>

      <main className="max-w-md mx-auto p-5">
        <div className="space-y-5">
          {[
            { key: "name", label: "Full Name", placeholder: "e.g. Chinyere Okafor", type: "text", required: true },
            { key: "phone", label: "Phone Number", placeholder: "e.g. 08012345678", type: "tel", required: true },
            { key: "note", label: "Note", placeholder: "e.g. Prefers WhatsApp, buys in bulk…", type: "text", required: false },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8B96B0] mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="w-full bg-[#131E35] border border-[#1E2B45] focus:border-[#00E5A0] rounded-xl px-4 py-3.5 text-[#F7F4EF] text-sm outline-none transition-colors placeholder:text-[#2A3B5A]"
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className={`w-full rounded-xl py-4 font-bold text-base transition-all font-display ${
              isValid
                ? "bg-[#00E5A0] hover:bg-[#00C988] text-[#0F1729]"
                : "bg-[#1E2B45] text-[#4A5568] cursor-not-allowed"
            }`}
          >
            {saving ? "Saving…" : "Save Customer"}
          </button>
        </div>
      </main>
    </div>
  );
}
