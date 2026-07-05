"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/actions/data";

export function DeleteProductButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("למחוק את המוצר?")) startTransition(() => deleteProduct(id));
      }}
      disabled={pending}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      מחיקה
    </button>
  );
}
