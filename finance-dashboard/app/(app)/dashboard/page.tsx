import { createClient } from "@/lib/supabase/server";
import {
  computeCashFlow,
  computeExpenseBreakdown,
  computeMonthlySeries,
  computeProductProfit,
  formatCurrency,
  monthKey,
} from "@/lib/finance";
import { IncomeExpenseChart } from "./income-expense-chart";
import { ExpensePieChart } from "./expense-pie-chart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: transactions }, { data: products }, { data: adCampaigns }] = await Promise.all([
    supabase.from("transactions").select("*"),
    supabase.from("products").select("*"),
    supabase.from("ad_campaigns").select("*"),
  ]);

  const tx = transactions ?? [];
  const thisMonth = monthKey(new Date().toISOString());
  const monthTx = tx.filter((t) => monthKey(t.date) === thisMonth);

  const revenue = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const netProfit = revenue - expenses;
  const cashFlow = computeCashFlow(tx);

  const series = computeMonthlySeries(tx, 6);
  const expenseBreakdown = computeExpenseBreakdown(monthTx);

  const productRows = computeProductProfit(monthTx, adCampaigns ?? [], products ?? []).slice(0, 5);

  const monthAdSpend = monthTx
    .filter((t) => t.type === "expense" && t.category === "advertising")
    .reduce((s, t) => s + Number(t.amount), 0);
  const monthAdSpendTotal =
    monthAdSpend + (adCampaigns ?? []).filter((c) => monthKey(c.date) === thisMonth).reduce((s, c) => s + Number(c.spend), 0);
  const grossProfit = revenue - monthTx
    .filter((t) => t.type === "expense" && t.category === "product_cost")
    .reduce((s, t) => s + Number(t.amount), 0);
  const adWarning = monthAdSpendTotal > 0 && monthAdSpendTotal > grossProfit;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">דשבורד ראשי</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="label">הכנסות החודש</p>
          <p className="text-2xl font-bold">{formatCurrency(revenue)}</p>
        </div>
        <div className="card">
          <p className="label">הוצאות החודש</p>
          <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
        </div>
        <div className="card ring-2 ring-emerald-500">
          <p className="label">רווח נקי החודש</p>
          <p className={`text-3xl font-extrabold ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
        <div className="card">
          <p className="label">תזרים נוכחי (יתרה זמינה)</p>
          <p className={`text-2xl font-bold ${cashFlow.netAvailable >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {formatCurrency(cashFlow.netAvailable)}
          </p>
        </div>
      </div>

      {adWarning && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          ⚠️ הוצאות הפרסום החודש ({formatCurrency(monthAdSpendTotal)}) גדולות מהרווח הגולמי (
          {formatCurrency(grossProfit)}) — כדאי לבדוק את יעילות הקמפיינים.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">
            הכנסות מול הוצאות — 6 חודשים אחרונים
          </h2>
          <IncomeExpenseChart data={series} />
        </div>
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">פילוח הוצאות החודש</h2>
          <ExpensePieChart data={expenseBreakdown} />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">5 המוצרים הרווחיים ביותר החודש</h2>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800">
              <th className="py-2 pl-2">מוצר</th>
              <th className="py-2 pl-2">הכנסה</th>
              <th className="py-2 pl-2">רווח נקי</th>
              <th className="py-2 pl-2">% רווח</th>
            </tr>
          </thead>
          <tbody>
            {productRows.map((r) => (
              <tr key={r.productId ?? "none"} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="py-2 pl-2 font-medium">{r.productName}</td>
                <td className="py-2 pl-2">{formatCurrency(r.revenue)}</td>
                <td className={`py-2 pl-2 font-bold ${r.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(r.netProfit)}
                </td>
                <td className="py-2 pl-2">{r.marginPct.toFixed(0)}%</td>
              </tr>
            ))}
            {productRows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400">
                  אין עדיין נתונים החודש
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
