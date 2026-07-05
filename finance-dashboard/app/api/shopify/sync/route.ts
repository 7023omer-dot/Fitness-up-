import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ShopifyLineItem {
  id: number;
  title: string;
  quantity: number;
  price: string;
}

interface ShopifyOrder {
  id: number;
  created_at: string;
  line_items: ShopifyLineItem[];
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!domain || !token) {
    return NextResponse.json(
      { error: "חיבור Shopify לא מוגדר (חסרים SHOPIFY_STORE_DOMAIN / SHOPIFY_ADMIN_API_TOKEN)" },
      { status: 500 },
    );
  }

  const shopifyRes = await fetch(
    `https://${domain}/admin/api/2024-10/orders.json?status=any&limit=250`,
    { headers: { "X-Shopify-Access-Token": token } },
  );

  if (!shopifyRes.ok) {
    return NextResponse.json(
      { error: `שגיאה בחיבור ל-Shopify (${shopifyRes.status})` },
      { status: 502 },
    );
  }

  const { orders } = (await shopifyRes.json()) as { orders: ShopifyOrder[] };

  const titles = new Set<string>();
  for (const order of orders) {
    for (const item of order.line_items) titles.add(item.title.trim());
  }

  const { data: existingProducts } = await supabase.from("products").select("id, name");
  const nameToId = new Map((existingProducts ?? []).map((p) => [p.name.trim().toLowerCase(), p.id]));

  const missingNames = Array.from(titles).filter((t) => !nameToId.has(t.toLowerCase()));
  if (missingNames.length > 0) {
    const { data: created } = await supabase
      .from("products")
      .insert(missingNames.map((name) => ({ name, cost: 0 })))
      .select("id, name");
    for (const p of created ?? []) nameToId.set(p.name.trim().toLowerCase(), p.id);
  }

  const rows = orders.flatMap((order) =>
    order.line_items.map((item) => ({
      type: "income" as const,
      category: "sale" as const,
      amount: Number(item.price) * item.quantity,
      product_id: nameToId.get(item.title.trim().toLowerCase()) ?? null,
      quantity: item.quantity,
      date: order.created_at.slice(0, 10),
      source: "shopify" as const,
      external_id: `${order.id}-${item.id}`,
      created_by: user.id,
    })),
  );

  if (rows.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  const { error, data } = await supabase
    .from("transactions")
    .upsert(rows, { onConflict: "source,external_id", ignoreDuplicates: true })
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ imported: data?.length ?? 0, ordersScanned: orders.length });
}
