import { createClient } from "@supabase/supabase-js";
import type { Customer } from "@/types/customer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typed helpers

export async function getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("last_order_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

export async function createCustomer(input: {
    name: string;
    phone: string;
    note?: string;
    last_order_date?: string;
}): Promise<Customer> {
    const { data, error } = await supabase
        .from("customers")
        .insert([
            {
                name: input.name,
                phone: input.phone,
                note: input.note ?? null,
                last_order_date:
                    input.last_order_date ?? new Date().toISOString().split("T")[0],
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateCustomer(
    id: string,
    updates: Partial<Omit<Customer, "id" | "created_at">>
): Promise<Customer> {
    const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

export async function getDueCustomers(): Promise<Customer[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoff = thirtyDaysAgo.toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .lt("last_order_date", cutoff)
        .order("last_order_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}
