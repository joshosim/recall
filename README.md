# Recall — Customer Follow-Up CRM

> Never let a customer go cold.

Recall is a lightweight CRM built for small business owners who sell physical products or services and need a simple way to track when customers are due for a follow-up. No complex pipelines, no bloated dashboards — just a clean list that tells you who to call or WhatsApp today.

---

## The Problem It Solves

Most small business owners lose repeat customers not because the customer left angry, but because no one followed up. Recall solves this with one rule: if a customer hasn't ordered in **30 days**, they show up on your follow-up list.

---

## Features

- **Customer list** — add customers with name, phone, and a short note
- **Heat ring indicator** — circular arc on each card fills up red as days since last order increase; encodes urgency at a glance
- **Status badges** — 🟢 Active (0–14 days), 🟡 Soon (15–30 days), 🔴 Due (30+ days)
- **Follow-ups tab** — filtered view of only overdue customers with a single call-to-action
- **WhatsApp deep link** — opens WhatsApp with a pre-filled greeting for the customer
- **Mark as Ordered** — resets the follow-up timer for a customer with one tap
- **Search** — filter customers by name or phone number
- **Responsive layout** — right-side detail panel on desktop, bottom sheet drawer on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database + Auth | Supabase |
| Deployment | Vercel |
| Styling | Tailwind CSS |
| Fonts | Space Grotesk, Inter (Google Fonts) |

---

## Project Structure

```
recall/
├── app/
│   ├── layout.tsx            # Root layout, font imports
│   ├── page.tsx              # Dashboard (all customers)
│   ├── follow-ups/
│   │   └── page.tsx          # Overdue customers list
│   ├── customers/
│   │   ├── new/
│   │   │   └── page.tsx      # Add customer form
│   │   └── [id]/
│   │       └── page.tsx      # Customer detail
│   └── api/
│       └── customers/
│           ├── route.ts      # GET all, POST new
│           └── [id]/
│               └── route.ts  # PATCH (update), DELETE
├── components/
│   ├── CustomerCard.tsx      # Card with heat ring + status badge
│   ├── HeatRing.tsx          # SVG arc indicator
│   ├── StatusBadge.tsx       # Due / Soon / Active pill
│   ├── DetailPanel.tsx       # Customer detail (desktop sidebar)
│   ├── BottomSheet.tsx       # Customer detail (mobile drawer)
│   └── AddCustomerModal.tsx  # Bottom sheet form
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # daysSince(), getStatus() helpers
├── types/
│   └── customer.ts           # Customer type definition
└── public/
    └── manifest.json         # PWA manifest (Phase 2)
```

---

## Database Schema (Supabase)

```sql
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  note text,
  last_order_date date default current_date,
  created_at timestamptz default now()
);

-- Index for fast follow-up queries
create index idx_customers_last_order on customers (last_order_date);

-- Row Level Security (enable after auth setup)
alter table customers enable row level security;
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/recall.git
cd recall
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard under **Settings → API**.

### 3. Create the database table

Copy the SQL from the schema section above and run it in your Supabase **SQL Editor**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Core Logic

The follow-up system is intentionally simple. There are no complex scoring algorithms.

```ts
// lib/utils.ts

export function daysSince(dateStr: string): number {
  const last = new Date(dateStr);
  const today = new Date();
  return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStatus(days: number): "active" | "warning" | "due" {
  if (days > 30) return "due";
  if (days > 14) return "warning";
  return "active";
}
```

The heat ring arc is computed directly from this value — no backend needed for the visual logic.

---

## Roadmap

### Phase 1 — MVP (current)
- [x] Add, view, and search customers
- [x] Follow-up list (30+ day rule)
- [x] WhatsApp deep link with pre-filled message
- [x] Mark as Ordered (reset timer)
- [x] Heat ring indicator

### Phase 2 — PWA + Reminders
- [ ] `manifest.json` + service worker for PWA install
- [ ] Daily push notification: "You have 5 customers to follow up with today"
- [ ] Supabase Edge Function cron job (runs daily at 8AM)

### Phase 3 — Automation
- [ ] Auto-send WhatsApp messages via WhatsApp Business API
- [ ] Bulk follow-up action ("Send to all due customers")
- [ ] Basic analytics: response rate, re-order rate per customer

---

## WhatsApp Integration

The current implementation uses a deep link — no API key required:

```ts
const waLink = `https://wa.me/234${phone.replace(/^0/, "")}?text=${
  encodeURIComponent(`Hi ${firstName}! Just checking in 👋`)
}`;
```

This opens the WhatsApp app or web with the message pre-filled. The user still taps Send — giving them a chance to personalise before sending.

For fully automated sending (Phase 3), you'll need a verified **WhatsApp Business API** account via Meta or a provider like Twilio or Termii (recommended for Nigerian numbers).

---

## Deployment

This project deploys to Vercel with zero config.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Contributing

This is a personal project, but PRs are welcome. Keep things simple — the goal is a tool a market trader in Abuja can use on their phone, not a full CRM platform.

---

## License

MIT