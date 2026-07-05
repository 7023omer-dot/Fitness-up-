"use client";

import { useActionState, useRef, useEffect } from "react";
import { addProduct } from "@/app/actions/data";

export function AddProductForm() {
  const [state, action, pending] = useActionState(addProduct, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="label" htmlFor="name">
          שם מוצר
        </label>
        <input id="name" name="name" required className="input" placeholder="לדוגמה: המסרק" />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="cost">
          עלות ליחידה (₪)
        </label>
        <input id="cost" name="cost" type="number" step="0.01" min="0" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "מוסיף..." : "הוספה"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
