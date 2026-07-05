"use client";

import { useActionState, useRef, useEffect } from "react";
import { addAdCampaign } from "@/app/actions/data";
import { PLATFORM_LABELS } from "@/lib/database.types";

export function AddCampaignForm({ products }: { products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(addAdCampaign, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <div className="w-40">
        <label className="label" htmlFor="platform">
          פלטפורמה
        </label>
        <select id="platform" name="platform" required className="input">
          {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-48">
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
      <div className="w-32">
        <label className="label" htmlFor="spend">
          הוצאה (₪)
        </label>
        <input id="spend" name="spend" type="number" step="0.01" min="0" required className="input" />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="attributed_revenue">
          הכנסה מיוחסת (₪)
        </label>
        <input
          id="attributed_revenue"
          name="attributed_revenue"
          type="number"
          step="0.01"
          min="0"
          className="input"
        />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="date">
          תאריך
        </label>
        <input id="date" name="date" type="date" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "מוסיף..." : "הוספה"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
