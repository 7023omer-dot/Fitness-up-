-- צומחים מחדש — סכימת בסיס נתונים
-- הרצה: פתח את Supabase Dashboard -> SQL Editor -> הדבק והרץ קובץ זה.

create extension if not exists "pgcrypto";

-- מוצרים
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cost numeric(12, 2) not null default 0, -- עלות ליחידה
  created_at timestamptz not null default now()
);

-- עסקאות (הכנסות + הוצאות)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  category text not null check (
    category in (
      'sale',            -- מכירה (הכנסה)
      'product_cost',     -- עלות מוצר
      'advertising',      -- פרסום
      'processing_fee',   -- עמלת סליקה
      'shipping',         -- משלוח
      'software',         -- אפליקציות/תוכנה
      'other'             -- אחר
    )
  ),
  product_id uuid references products (id) on delete set null,
  amount numeric(12, 2) not null,
  quantity integer,
  date date not null default current_date,
  paid_to text,
  note text,
  paid boolean not null default true, -- false = הוצאה/התחייבות שטרם שולמה בפועל (לתזרים מזומנים)
  source text not null default 'manual' check (source in ('manual', 'csv_import', 'shopify')),
  external_id text, -- מזהה חיצוני (לדוגמה מספר הזמנת Shopify) למניעת כפילויות
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (source, external_id)
);

create index if not exists transactions_date_idx on transactions (date);
create index if not exists transactions_product_idx on transactions (product_id);
create index if not exists transactions_type_idx on transactions (type);

-- קמפיינים / הוצאות פרסום לצורך חישוב ROAS
create table if not exists ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('facebook', 'tiktok', 'google', 'other')),
  product_id uuid references products (id) on delete set null,
  spend numeric(12, 2) not null default 0,
  attributed_revenue numeric(12, 2) not null default 0,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists ad_campaigns_date_idx on ad_campaigns (date);

-- Row Level Security: כל משתמש מחובר (עומר + שותף) רואה ועורך את כל הנתונים המשותפים
alter table products enable row level security;
alter table transactions enable row level security;
alter table ad_campaigns enable row level security;

create policy "authenticated can read products" on products
  for select to authenticated using (true);
create policy "authenticated can write products" on products
  for insert to authenticated with check (true);
create policy "authenticated can update products" on products
  for update to authenticated using (true);
create policy "authenticated can delete products" on products
  for delete to authenticated using (true);

create policy "authenticated can read transactions" on transactions
  for select to authenticated using (true);
create policy "authenticated can write transactions" on transactions
  for insert to authenticated with check (true);
create policy "authenticated can update transactions" on transactions
  for update to authenticated using (true);
create policy "authenticated can delete transactions" on transactions
  for delete to authenticated using (true);

create policy "authenticated can read ad_campaigns" on ad_campaigns
  for select to authenticated using (true);
create policy "authenticated can write ad_campaigns" on ad_campaigns
  for insert to authenticated with check (true);
create policy "authenticated can update ad_campaigns" on ad_campaigns
  for update to authenticated using (true);
create policy "authenticated can delete ad_campaigns" on ad_campaigns
  for delete to authenticated using (true);

-- לאחר הרצת הסכימה: Authentication -> Users -> Add user, פעמיים (עומר + ברקאי)
