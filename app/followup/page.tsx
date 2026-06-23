import { getDueCustomers } from "@/lib/supabase";
import CustomerCard from "@/components/CustomerCard";
import Link from "next/link";

export const revalidate = 0;

export default async function FollowUpsPage() {
  const customers = await getDueCustomers();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#1E2B45]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#131E35] text-[#8B96B0] hover:text-[#F7F4EF] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-bold font-display text-[#F7F4EF]">Follow-ups</h1>
            <p className="text-[11px] text-[#8B96B0]">
              {customers.length} customer{customers.length !== 1 ? "s" : ""} to reach out to
            </p>
          </div>
        </div>
      </header>

      <main className="p-5">
        {customers.length > 0 ? (
          <>
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 mb-5">
              <span className="text-2xl">📣</span>
              <div>
                <p className="text-sm font-bold text-red-400 font-display">Reach out today</p>
                <p className="text-xs text-[#8B96B0]">
                  These {customers.length} customers haven&apos;t ordered in 30+ days
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {customers.map((c) => (
                <CustomerCard key={c.id} customer={c} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎉</div>
            <p className="font-bold text-[#F7F4EF] font-display text-lg mb-2">All caught up!</p>
            <p className="text-sm text-[#8B96B0]">No customers need follow-up right now.</p>
            <Link
              href="/"
              className="inline-block mt-6 text-sm text-[#00E5A0] hover:underline font-display"
            >
              Back to dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
