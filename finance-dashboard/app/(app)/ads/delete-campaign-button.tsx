"use client";

import { useTransition } from "react";
import { deleteAdCampaign } from "@/app/actions/data";

export function DeleteCampaignButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("למחוק את הקמפיין?")) startTransition(() => deleteAdCampaign(id));
      }}
      disabled={pending}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      מחיקה
    </button>
  );
}
