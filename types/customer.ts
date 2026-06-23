export type CustomerStatus = "active" | "warning" | "due";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  note: string | null;
  last_order_date: string; // ISO date string YYYY-MM-DD
  created_at: string;
}

export interface NewCustomerInput {
  name: string;
  phone: string;
  note?: string;
  last_order_date?: string;
}
