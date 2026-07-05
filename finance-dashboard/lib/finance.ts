import type { AdCampaign, Product, Transaction } from "@/lib/database.types";

export interface ProductProfitRow {
  productId: string | null;
  productName: string;
  units: number;
  revenue: number;
  productCost: number;
  adSpend: number;
  fees: number;
  netProfit: number;
  marginPct: number;
}

export function computeProductProfit(
  transactions: Transaction[],
  adCampaigns: AdCampaign[],
  products: Product[],
): ProductProfitRow[] {
  const productNames = new Map(products.map((p) => [p.id, p.name]));
  const rows = new Map<string, ProductProfitRow>();

  const key = (id: string | null) => id ?? "__none__";

  const ensureRow = (id: string | null) => {
    const k = key(id);
    if (!rows.has(k)) {
      rows.set(k, {
        productId: id,
        productName: id ? (productNames.get(id) ?? "מוצר לא ידוע") : "ללא שיוך מוצר",
        units: 0,
        revenue: 0,
        productCost: 0,
        adSpend: 0,
        fees: 0,
        netProfit: 0,
        marginPct: 0,
      });
    }
    return rows.get(k)!;
  };

  for (const t of transactions) {
    if (t.type === "income" && t.category === "sale") {
      const row = ensureRow(t.product_id);
      row.revenue += Number(t.amount);
      row.units += t.quantity ?? 0;
    } else if (t.type === "expense" && t.product_id) {
      const row = ensureRow(t.product_id);
      if (t.category === "product_cost") row.productCost += Number(t.amount);
      else if (t.category === "processing_fee" || t.category === "shipping")
        row.fees += Number(t.amount);
    }
  }

  for (const c of adCampaigns) {
    const row = ensureRow(c.product_id);
    row.adSpend += Number(c.spend);
  }

  for (const row of rows.values()) {
    row.netProfit = row.revenue - row.productCost - row.adSpend - row.fees;
    row.marginPct = row.revenue > 0 ? (row.netProfit / row.revenue) * 100 : 0;
  }

  return Array.from(rows.values())
    .filter((r) => r.revenue > 0 || r.productCost > 0 || r.adSpend > 0 || r.fees > 0)
    .sort((a, b) => b.netProfit - a.netProfit);
}

export interface RoasRow extends AdCampaign {
  roas: number;
  profit: number;
}

export function computeRoas(adCampaigns: AdCampaign[]): RoasRow[] {
  return adCampaigns
    .map((c) => ({
      ...c,
      roas: c.spend > 0 ? c.attributed_revenue / c.spend : 0,
      profit: c.attributed_revenue - c.spend,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface CashFlowSummary {
  cashIn: number;
  paidOut: number;
  openLiabilities: number;
  netAvailable: number;
}

export function computeCashFlow(transactions: Transaction[]): CashFlowSummary {
  let cashIn = 0;
  let paidOut = 0;
  let openLiabilities = 0;

  for (const t of transactions) {
    if (t.type === "income") {
      cashIn += Number(t.amount);
    } else if (t.type === "expense") {
      if (t.paid) paidOut += Number(t.amount);
      else openLiabilities += Number(t.amount);
    }
  }

  return { cashIn, paidOut, openLiabilities, netAvailable: cashIn - paidOut };
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

export interface MonthlySeriesPoint {
  month: string;
  income: number;
  expense: number;
}

export function computeMonthlySeries(transactions: Transaction[], months = 6): MonthlySeriesPoint[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const totals = new Map(keys.map((k) => [k, { income: 0, expense: 0 }]));

  for (const t of transactions) {
    const key = monthKey(t.date);
    const bucket = totals.get(key);
    if (!bucket) continue;
    if (t.type === "income") bucket.income += Number(t.amount);
    else bucket.expense += Number(t.amount);
  }

  return keys.map((k) => ({ month: k, ...totals.get(k)! }));
}

const EXPENSE_CATEGORY_LABELS_HE: Record<string, string> = {
  product_cost: "עלות מוצר",
  advertising: "פרסום",
  processing_fee: "עמלות",
  shipping: "משלוח",
  software: "תוכנה",
  other: "אחר",
};

export interface ExpenseSlice {
  category: string;
  amount: number;
}

export function computeExpenseBreakdown(transactions: Transaction[]): ExpenseSlice[] {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const label = EXPENSE_CATEGORY_LABELS_HE[t.category] ?? t.category;
    totals.set(label, (totals.get(label) ?? 0) + Number(t.amount));
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}
