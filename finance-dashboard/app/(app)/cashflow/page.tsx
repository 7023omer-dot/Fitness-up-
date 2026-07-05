import { createClient } from "@/lib/supabase/server";
import { computeCashFlow, formatCurrency } from "@/lib/finance";
import { CATEGORY_LABELS } from "@/lib/database.types";

export default async function CashFlowPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  const summary = computeCashFlow(transactions ?? []);
  const openItems = (transactions ?? []).filter((t) => t.type === "expense" && !t.paid);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">תזרים מזומנים</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="label">כסף שנכנס בפועל</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.cashIn)}</p>
        </div>
        <div className="card">
          <p className="label">התחייבויות פתוחות (טרם שולמו)</p>
          <p className="text-2xl font-bold text-amber-600">
            {formatCurrency(summary.openLiabilities)}
          </p>
        </div>
        <div className="card">
          <p className="label">יתרה נטו זמינה</p>
          <p
            className={`text-2xl font-bold ${summary.netAvailable >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(summary.netAvailable)}
          </p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">
          התחייבויות פתוחות לספקים (הוצאות שסומנו כ&quot;טרם שולם&quot;)
        </h2>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800">
              <th className="py-2 pl-2">תאריך</th>
              <th className="py-2 pl-2">קטגוריה</th>
              <th className="py-2 pl-2">למי משולם</th>
              <th className="py-2 pl-2">סכום</th>
            </tr>
          </thead>
          <tbody>
            {openItems.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="py-2 pl-2">{t.date}</td>
                <td className="py-2 pl-2">{CATEGORY_LABELS[t.category]}</td>
                <td className="py-2 pl-2">{t.paid_to ?? "-"}</td>
                <td className="py-2 pl-2 font-medium text-amber-600">
                  {formatCurrency(Number(t.amount))}
                </td>
              </tr>
            ))}
            {openItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400">
                  אין התחייבויות פתוחות כרגע
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
