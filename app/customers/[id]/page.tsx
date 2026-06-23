import { notFound } from "next/navigation";
import Link from "next/link";
import DetailPanel from "@/components/DetailPanel";
import { getCustomerById } from "@/lib/supabase";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const customer = await getCustomerById(params.id);

  if (!customer) notFound();

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
        <h1 className="text-base font-bold font-display text-[#F7F4EF]">Customer</h1>
      </header>

      <main className="max-w-md mx-auto p-5">
        <DetailPanel customer={customer} />
      </main>
    </div>
  );
}
