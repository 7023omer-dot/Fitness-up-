import { createClient } from "@/lib/supabase/server";
import { computeRoas, formatCurrency } from "@/lib/finance";
import { PLATFORM_LABELS } from "@/lib/database.types";
import { AddCampaignForm } from "./add-campaign-form";
import { DeleteCampaignButton } from "./delete-campaign-button";
import { RoasTrendChart } from "./roas-trend-chart";

export default async function AdsPage() {
  const supabase = await createClient();
  const [{ data: campaigns }, { data: products }] = await Promise.all([
    supabase.from("ad_campaigns").select("*").order("date", { ascending: false }),
    supabase.from("products").select("id, name").order("name"),
  ]);

  const rows = computeRoas(campaigns ?? []);
  const productNames = new Map((products ?? []).map((p) => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">פרסום / ROAS</h1>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת קמפיין</h2>
        <AddCampaignForm products={products ?? []} />
      </div>

      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">מגמת ROAS לאורך זמן</h2>
        <RoasTrendChart rows={rows} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800">
              <th className="py-2 pl-2">תאריך</th>
              <th className="py-2 pl-2">פלטפורמה</th>
              <th className="py-2 pl-2">מוצר</th>
              <th className="py-2 pl-2">הוצאה</th>
              <th className="py-2 pl-2">הכנסה מיוחסת</th>
              <th className="py-2 pl-2">ROAS</th>
              <th className="py-2 pl-2">רווח</th>
              <th className="py-2 pl-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="py-2 pl-2">{r.date}</td>
                <td className="py-2 pl-2">{PLATFORM_LABELS[r.platform]}</td>
                <td className="py-2 pl-2">
                  {r.product_id ? (productNames.get(r.product_id) ?? "-") : "-"}
                </td>
                <td className="py-2 pl-2">{formatCurrency(r.spend)}</td>
                <td className="py-2 pl-2">{formatCurrency(r.attributed_revenue)}</td>
                <td
                  className={`py-2 pl-2 font-bold ${r.roas < 2 ? "text-red-600" : "text-emerald-600"}`}
                >
                  {r.roas.toFixed(2)}
                  {r.roas < 2 && " ⚠️"}
                </td>
                <td
                  className={`py-2 pl-2 font-medium ${r.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {formatCurrency(r.profit)}
                </td>
                <td className="py-2 pl-2">
                  <DeleteCampaignButton id={r.id} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">
                  אין עדיין קמפיינים
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
