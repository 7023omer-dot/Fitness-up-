"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ShopifySyncButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function sync() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/shopify/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "שגיאה בייבוא מ-Shopify");
      } else {
        setMsg(`יובאו ${data.imported} עסקאות חדשות מתוך ${data.ordersScanned ?? 0} הזמנות`);
        startTransition(() => router.refresh());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={sync} disabled={loading} className="btn-secondary text-xs">
        {loading ? "מייבא מ-Shopify..." : "ייבוא מ-Shopify"}
      </button>
      {msg && <p className="text-xs text-slate-500">{msg}</p>}
    </div>
  );
}
