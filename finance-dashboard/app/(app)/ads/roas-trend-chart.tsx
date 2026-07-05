"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RoasRow } from "@/lib/finance";

export function RoasTrendChart({ rows }: { rows: RoasRow[] }) {
  const data = [...rows]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((r) => ({ date: r.date, roas: Number(r.roas.toFixed(2)) }));

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">אין עדיין מספיק נתונים לגרף</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={2} stroke="#dc2626" strokeDasharray="4 4" label="סף 2" />
        <Line type="monotone" dataKey="roas" stroke="#059669" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
