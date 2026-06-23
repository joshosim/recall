"use client";

import { useState, useMemo, useEffect } from "react";
import CustomerCard from "@/components/CustomerCard";
import DetailPanel from "@/components/DetailPanel";
import BottomSheet from "@/components/BottomSheet";
import AddCustomerModal from "@/components/AddCustomerModal";
import type { Customer } from "@/types/customer";
import { daysSince, getStatus } from "@/lib/utils";

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "followups">("all");

  useEffect(() => {
    fetch("/api/customers")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data?.error ?? "Failed to load customers");
        }
        return data;
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Customer API returned an unexpected response");
        }
        setCustomers(data);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        setCustomers([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load customers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const dueCount = useMemo(() =>
    customers.filter((c) =>
      getStatus(daysSince(c.last_order_date)) === "due").length,
    [customers]
  );

  const filtered = useMemo(() => {
    let list = [...customers];
    if (tab === "followups") {
      list = list.filter((c) => getStatus(daysSince(c.last_order_date)) === "due");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }
    // Sort: most overdue first
    return list.sort((a, b) => daysSince(b.last_order_date) - daysSince(a.last_order_date));
  }, [customers, tab, search]);

  const handleMarkOrdered = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, last_order_date: today } : c))
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, last_order_date: today } : prev
    );
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#1E2B45] shrink-0">
        <div>
          <h1 className="text-lg font-black tracking-tight font-display">
            <span className="text-[#00E5A0]">Re</span>call
          </h1>
          <p className="text-[11px] text-[#8B96B0] mt-0.5">
            {customers.length} customers · {dueCount} need follow-up
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#00E5A0] hover:bg-[#00C988] text-[#0F1729] font-bold text-sm rounded-xl px-4 py-2 transition-colors font-display"
        >
          <span className="text-lg leading-none">+</span> Add
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex gap-0 px-5 border-b border-[#1E2B45] shrink-0">
        {[
          { key: "all", label: "All Customers" },
          { key: "followups", label: `Follow-ups${dueCount > 0 ? ` (${dueCount})` : ""}` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as "all" | "followups"); setSelected(null); }}
            className={`pb-3 pt-3 mr-6 text-sm font-semibold border-b-2 transition-all font-display ${tab === t.key
              ? "text-[#F7F4EF] border-[#00E5A0]"
              : "text-[#8B96B0] border-transparent hover:text-[#F7F4EF]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customer list */}
        <main className="flex-1 overflow-y-auto p-5">
          {loadError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 mb-4">
              <p className="text-sm font-bold text-red-400 font-display">Couldn&apos;t load customers</p>
              <p className="text-xs text-[#8B96B0] mt-0.5">{loadError}</p>
            </div>
          )}

          {/* Search (all tab only) */}
          {tab === "all" && (
            <div className="flex items-center gap-3 bg-[#131E35] border border-[#1E2B45] rounded-xl px-4 py-2.5 mb-4">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or number…"
                className="bg-transparent outline-none text-[#F7F4EF] text-sm flex-1 placeholder:text-[#2A3B5A]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#4A5568] hover:text-[#8B96B0] text-lg leading-none">×</button>
              )}
            </div>
          )}

          {/* Follow-ups banner */}
          {tab === "followups" && dueCount > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 mb-4">
              <span className="text-2xl">📣</span>
              <div>
                <p className="text-sm font-bold text-red-400 font-display">Reach out today</p>
                <p className="text-xs text-[#8B96B0]">{dueCount} customers haven&apos;t ordered in 30+ days</p>
              </div>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-17.5 bg-[#131E35] rounded-2xl animate-pulse border border-[#1E2B45]" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-2.5">
              {filtered.map((c) => (
                <CustomerCard
                  key={c.id}
                  customer={c}
                  selected={selected?.id === c.id}
                  onClick={setSelected}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="text-4xl mb-4">{tab === "followups" ? "🎉" : "🔍"}</div>
              <p className="font-bold text-[#8B96B0] font-display mb-1">
                {tab === "followups" ? "All caught up!" : "No results"}
              </p>
              <p className="text-sm text-[#4A5568]">
                {tab === "followups"
                  ? "No customers need follow-up right now."
                  : "Try a different name or number."}
              </p>
              {customers.length === 0 && tab === "all" && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="mt-6 bg-[#00E5A0] text-[#0F1729] font-bold rounded-xl px-6 py-3 font-display text-sm"
                >
                  Add your first customer
                </button>
              )}
            </div>
          )}
        </main>

        {/* Desktop detail panel */}
        {selected && (
          <aside className="hidden md:block w-75 lg:w-[320px] border-l border-[#1E2B45] p-5 overflow-y-auto shrink-0">
            <DetailPanel
              customer={selected}
              onClose={() => setSelected(null)}
              onMarkOrdered={handleMarkOrdered}
              onDelete={handleDelete}
            />
          </aside>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden">
        <BottomSheet
          customer={selected}
          onClose={() => setSelected(null)}
          onMarkOrdered={handleMarkOrdered}
          onDelete={handleDelete}
        />
      </div>

      {/* Add modal */}
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
