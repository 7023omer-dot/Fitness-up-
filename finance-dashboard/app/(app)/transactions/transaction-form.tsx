"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { addTransaction } from "@/app/actions/data";
import { CATEGORY_LABELS, type TransactionCategory } from "@/lib/database.types";

const INCOME_CATEGORIES: TransactionCategory[] = ["sale"];
const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "product_cost",
  "advertising",
  "processing_fee",
  "shipping",
  "software",
  "other",
];

export function TransactionForm({ products }: { products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(addTransaction, undefined);
  const [type, setType] = useState<"income" | "expense">("income");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <div className="w-32">
        <label className="label" htmlFor="type">
          סוג
        </label>
        <select
          id="type"
          name="type"
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">הכנסה</option>
          <option value="expense">הוצאה</option>
        </select>
      </div>
      <div className="w-40">
        <label className="label" htmlFor="category">
          קטגוריה
        </label>
        <select id="category" name="category" required className="input">
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <div className="w-44">
        <label className="label" htmlFor="product_id">
          מוצר (אופציונלי)
        </label>
        <select id="product_id" name="product_id" className="input">
          <option value="">- ללא -</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-28">
        <label className="label" htmlFor="amount">
          סכום (₪)
        </label>
        <input id="amount" name="amount" type="number" step="0.01" min="0" required className="input" />
      </div>
      <div className="w-24">
        <label className="label" htmlFor="quantity">
          כמות
        </label>
        <input id="quantity" name="quantity" type="number" min="0" className="input" />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="date">
          תאריך
        </label>
        <input id="date" name="date" type="date" className="input" />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="paid_to">
          למי שולם
        </label>
        <input id="paid_to" name="paid_to" className="input" />
      </div>
      <div className="w-48 flex-1">
        <label className="label" htmlFor="note">
          הערה
        </label>
        <input id="note" name="note" className="input" />
      </div>
      {type === "expense" && (
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="pending" value="true" className="size-4" />
          טרם שולם (התחייבות פתוחה)
        </label>
      )}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "שומר..." : "הוספה"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
