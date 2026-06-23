import { NextRequest, NextResponse } from "next/server";
import { getAllCustomers, createCustomer } from "@/lib/supabase";

export async function GET() {
    try {
        const customers = await getAllCustomers();
        return NextResponse.json(customers);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone, note, last_order_date } = body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        if (!phone || typeof phone !== "string" || !phone.trim()) {
            return NextResponse.json({ error: "Phone is required" }, { status: 400 });
        }

        const customer = await createCustomer({
            name: name.trim(),
            phone: phone.trim(),
            note: note?.trim() || undefined,
            last_order_date,
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
