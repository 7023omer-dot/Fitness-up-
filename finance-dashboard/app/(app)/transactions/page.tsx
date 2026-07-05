import { createClient } from "@/lib/supabase/server";
import { TransactionForm } from "./transaction-form";
import { TransactionsTable } from "./transactions-table";
import { ShopifySyncButton } from "./shopify-sync-button";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const [{ data: transactions }, { data: products }] = await Promise.all([
    supabase.from("transactions").select("*").order("date", { ascending: false }),
    supabase.from("products").select("id, name").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">עסקאות</h1>
        <ShopifySyncButton />
      </div>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת עסקה</h2>
        <TransactionForm products={products ?? []} />
      </div>

      <TransactionsTable transactions={transactions ?? []} products={products ?? []} />
    </div>
  );
}
