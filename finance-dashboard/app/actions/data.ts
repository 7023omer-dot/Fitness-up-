"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  AdPlatform,
  TransactionCategory,
  TransactionType,
} from "@/lib/database.types";

export type ActionState = { error?: string; success?: boolean } | undefined;

export async function addProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const cost = Number(formData.get("cost") ?? 0);

  if (!name) return { error: "יש להזין שם מוצר" };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({ name, cost });
  if (error) return { error: error.message };

  revalidatePath("/products");
  revalidatePath("/transactions");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/products");
  revalidatePath("/transactions");
}

export async function addTransaction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const type = String(formData.get("type") ?? "") as TransactionType;
  const category = String(formData.get("category") ?? "") as TransactionCategory;
  const amount = Number(formData.get("amount") ?? 0);
  const productId = String(formData.get("product_id") ?? "") || null;
  const quantityRaw = formData.get("quantity");
  const quantity = quantityRaw ? Number(quantityRaw) : null;
  const date = String(formData.get("date") ?? "") || new Date().toISOString().slice(0, 10);
  const paidTo = String(formData.get("paid_to") ?? "") || null;
  const note = String(formData.get("note") ?? "") || null;
  const paid = formData.get("pending") !== "true";

  if (!type || !category || !amount) {
    return { error: "יש למלא סוג, קטגוריה וסכום" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("transactions").insert({
    type,
    category,
    amount,
    product_id: productId,
    quantity,
    date,
    paid_to: paidTo,
    note,
    paid,
    created_by: user?.id ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/cashflow");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/cashflow");
}

export async function addAdCampaign(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const platform = String(formData.get("platform") ?? "") as AdPlatform;
  const spend = Number(formData.get("spend") ?? 0);
  const attributedRevenue = Number(formData.get("attributed_revenue") ?? 0);
  const productId = String(formData.get("product_id") ?? "") || null;
  const date = String(formData.get("date") ?? "") || new Date().toISOString().slice(0, 10);

  if (!platform || !spend) return { error: "יש למלא פלטפורמה והוצאה" };

  const supabase = await createClient();
  const { error } = await supabase.from("ad_campaigns").insert({
    platform,
    spend,
    attributed_revenue: attributedRevenue,
    product_id: productId,
    date,
  });

  if (error) return { error: error.message };

  revalidatePath("/ads");
  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteAdCampaign(id: string) {
  const supabase = await createClient();
  await supabase.from("ad_campaigns").delete().eq("id", id);
  revalidatePath("/ads");
  revalidatePath("/dashboard");
  revalidatePath("/products");
}

export interface CsvTransactionRow {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  product_name?: string;
  quantity?: number;
  date: string;
  paid_to?: string;
  note?: string;
}

export async function importTransactionsCsv(
  rows: CsvTransactionRow[],
): Promise<{ imported: number; error?: string }> {
  if (rows.length === 0) return { imported: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase.from("products").select("id, name");
  const nameToId = new Map((products ?? []).map((p) => [p.name.trim().toLowerCase(), p.id]));

  const payload = rows.map((r) => ({
    type: r.type,
    category: r.category,
    amount: r.amount,
    product_id: r.product_name ? (nameToId.get(r.product_name.trim().toLowerCase()) ?? null) : null,
    quantity: r.quantity ?? null,
    date: r.date,
    paid_to: r.paid_to ?? null,
    note: r.note ?? null,
    source: "csv_import" as const,
    created_by: user?.id ?? null,
  }));

  const { error } = await supabase.from("transactions").insert(payload);
  if (error) return { imported: 0, error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/cashflow");
  return { imported: payload.length };
}
