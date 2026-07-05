"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import { deleteTransaction, importTransactionsCsv, type CsvTransactionRow } from "@/app/actions/data";
import {
  CATEGORY_LABELS,
  type Transaction,
  type TransactionCategory,
  type TransactionType,
} from "@/lib/database.types";
import { formatCurrency } from "@/lib/finance";

type SortKey = "date" | "amount";

export function TransactionsTable({
  transactions,
  products,
}: {
  transactions: Transaction[];
  products: { id: string; name: string }[];
}) {
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TransactionCategory>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [pending, startTransition] = useTransition();
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productNames = useMemo(() => new Map(products.map((p) => [p.id, p.name])), [products]);

  const rows = useMemo(() => {
    let filtered = transactions;
    if (typeFilter !== "all") filtered = filtered.filter((t) => t.type === typeFilter);
    if (categoryFilter !== "all") filtered = filtered.filter((t) => t.category === categoryFilter);

    return [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "amount") return (Number(a.amount) - Number(b.amount)) * dir;
      return (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * dir;
    });
  }, [transactions, typeFilter, categoryFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function rowsToCsv() {
    return Papa.unparse(
      rows.map((t) => ({
        תאריך: t.date,
        סוג: t.type === "income" ? "הכנסה" : "הוצאה",
        קטגוריה: CATEGORY_LABELS[t.category],
        מוצר: t.product_id ? (productNames.get(t.product_id) ?? "") : "",
        סכום: t.amount,
        כמות: t.quantity ?? "",
        "למי שולם": t.paid_to ?? "",
        הערה: t.note ?? "",
        שולם: t.paid ? "כן" : "לא",
      })),
    );
  }

  function exportCsv() {
    const csv = "﻿" + rowsToCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `עסקאות-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportEmail() {
    setEmailMsg(null);
    const to = emailAddress.trim();
    if (!to) {
      setEmailMsg("יש להזין כתובת מייל");
      return;
    }
    const res = await fetch("/api/export/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, csv: rowsToCsv() }),
    });
    const data = await res.json();
    setEmailMsg(res.ok ? "הקובץ נשלח למייל בהצלחה" : `שגיאה בשליחה: ${data.error ?? "לא ידוע"}`);
  }

  function handleImportFile(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsed: CsvTransactionRow[] = (results.data as Record<string, string>[])
          .map((row) => {
            const type = (row["סוג"] === "הכנסה" ? "income" : "expense") as TransactionType;
            const categoryLabel = row["קטגוריה"];
            const categoryEntry = Object.entries(CATEGORY_LABELS).find(
              ([, label]) => label === categoryLabel,
            );
            const category = (categoryEntry?.[0] ?? "other") as TransactionCategory;
            const amount = Number(row["סכום"]);
            if (!amount || !row["תאריך"]) return null;
            const csvRow: CsvTransactionRow = {
              type,
              category,
              amount,
              product_name: row["מוצר"] || undefined,
              quantity: row["כמות"] ? Number(row["כמות"]) : undefined,
              date: row["תאריך"],
              paid_to: row["למי שולם"] || undefined,
              note: row["הערה"] || undefined,
            };
            return csvRow;
          })
          .filter((r): r is CsvTransactionRow => r !== null);

        const result = await importTransactionsCsv(parsed);
        setImportMsg(
          result.error ? `שגיאה בייבוא: ${result.error}` : `יובאו ${result.imported} עסקאות בהצלחה`,
        );
      },
    });
  }

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | TransactionType)}
          className="input w-36"
        >
          <option value="all">כל הסוגים</option>
          <option value="income">הכנסות</option>
          <option value="expense">הוצאות</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "all" | TransactionCategory)}
          className="input w-44"
        >
          <option value="all">כל הקטגוריות</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="mr-auto flex flex-wrap items-center gap-2">
          <button onClick={exportCsv} className="btn-secondary text-xs">
            ייצוא ל-CSV
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs">
            ייבוא מ-CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
          <input
            type="email"
            placeholder="כתובת מייל לשליחה"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="input w-48 text-xs"
          />
          <button onClick={exportEmail} className="btn-secondary text-xs">
            שליחת ייצוא למייל
          </button>
        </div>
      </div>
      {importMsg && <p className="text-xs text-slate-500">{importMsg}</p>}
      {emailMsg && <p className="text-xs text-slate-500">{emailMsg}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800">
              <th className="cursor-pointer py-2 pl-2" onClick={() => toggleSort("date")}>
                תאריך {sortKey === "date" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-2 pl-2">סוג</th>
              <th className="py-2 pl-2">קטגוריה</th>
              <th className="py-2 pl-2">מוצר</th>
              <th className="cursor-pointer py-2 pl-2" onClick={() => toggleSort("amount")}>
                סכום {sortKey === "amount" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-2 pl-2">למי שולם</th>
              <th className="py-2 pl-2">מקור</th>
              <th className="py-2 pl-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="py-2 pl-2">{t.date}</td>
                <td className="py-2 pl-2">
                  <span
                    className={
                      t.type === "income"
                        ? "rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded bg-red-100 px-2 py-0.5 text-xs text-red-700"
                    }
                  >
                    {t.type === "income" ? "הכנסה" : "הוצאה"}
                  </span>
                </td>
                <td className="py-2 pl-2">{CATEGORY_LABELS[t.category]}</td>
                <td className="py-2 pl-2">
                  {t.product_id ? (productNames.get(t.product_id) ?? "-") : "-"}
                </td>
                <td className="py-2 pl-2 font-medium">{formatCurrency(Number(t.amount))}</td>
                <td className="py-2 pl-2">{t.paid_to ?? "-"}</td>
                <td className="py-2 pl-2 text-xs text-slate-400">
                  {t.source === "manual" ? "ידני" : t.source === "csv_import" ? "CSV" : "Shopify"}
                </td>
                <td className="py-2 pl-2">
                  <button
                    disabled={pending}
                    onClick={() => {
                      if (confirm("למחוק את העסקה?"))
                        startTransition(() => deleteTransaction(t.id));
                    }}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">
                  אין עסקאות תואמות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
