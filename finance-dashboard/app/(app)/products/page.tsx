import { createClient } from "@/lib/supabase/server";
import { computeProductProfit } from "@/lib/finance";
import { formatCurrency } from "@/lib/finance";
import { AddProductForm } from "./add-product-form";
import { DeleteProductButton } from "./delete-product-button";

export default async function ProductsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: transactions }, { data: adCampaigns }] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("transactions").select("*"),
    supabase.from("ad_campaigns").select("*"),
  ]);

  const rows = computeProductProfit(transactions ?? [], adCampaigns ?? [], products ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">רווח לפי מוצר</h1>
      </div>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת מוצר חדש</h2>
        <AddProductForm />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800">
              <th className="py-2 pl-2">שם מוצר</th>
              <th className="py-2 pl-2">יחידות</th>
              <th className="py-2 pl-2">הכנסה</th>
              <th className="py-2 pl-2">עלות מוצר</th>
              <th className="py-2 pl-2">פרסום</th>
              <th className="py-2 pl-2">עמלות/משלוח</th>
              <th className="py-2 pl-2">רווח נקי</th>
              <th className="py-2 pl-2">% רווח</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.productId ?? "none"}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="py-2 pl-2 font-medium">{r.productName}</td>
                <td className="py-2 pl-2">{r.units}</td>
                <td className="py-2 pl-2">{formatCurrency(r.revenue)}</td>
                <td className="py-2 pl-2">{formatCurrency(r.productCost)}</td>
                <td className="py-2 pl-2">{formatCurrency(r.adSpend)}</td>
                <td className="py-2 pl-2">{formatCurrency(r.fees)}</td>
                <td
                  className={`py-2 pl-2 font-bold ${r.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {formatCurrency(r.netProfit)}
                </td>
                <td
                  className={`py-2 pl-2 font-medium ${r.marginPct >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {r.marginPct.toFixed(0)}%
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">
                  אין עדיין נתונים — הוסיפו עסקאות בעמוד העסקאות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">כל המוצרים</h2>
        <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
          {(products ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2">
              <span>
                {p.name} <span className="text-slate-400">— עלות: {formatCurrency(p.cost)}</span>
              </span>
              <DeleteProductButton id={p.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
