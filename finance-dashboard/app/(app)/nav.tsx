"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/dashboard", label: "דשבורד ראשי" },
  { href: "/transactions", label: "עסקאות" },
  { href: "/products", label: "רווח לפי מוצר" },
  { href: "/ads", label: "פרסום / ROAS" },
  { href: "/cashflow", label: "תזרים מזומנים" },
  { href: "/guide", label: "מדריך דרופשיפינג" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-secondary fixed top-3 right-3 z-40 md:hidden"
        aria-label="תפריט"
      >
        ☰
      </button>
      <nav
        className={`fixed inset-y-0 right-0 z-30 w-64 shrink-0 border-l border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-6 px-2">
          <h1 className="text-lg font-bold">צומחים מחדש</h1>
          <p className="text-xs text-slate-500">ניהול פיננסי</p>
        </div>
        <ul className="space-y-1">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
