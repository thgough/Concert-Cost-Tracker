"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Concert } from "@/types/database";
import { formatCurrency, getMonthlySpending } from "@/lib/concert-metrics";

export default function SpendingTimeline({ concerts }: { concerts: Concert[] }) {
  const data = getMonthlySpending(concerts);

  if (data.length === 0) {
    return (
      <p className="text-center opacity-70 py-8">
        Add concerts in different months to see spending trends.
      </p>
    );
  }

  return (
    <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
      <div className="card-body p-5 sm:p-6">
        <h3 className="card-title text-base">Spending over time</h3>
        <p className="text-xs opacity-60 -mt-1 mb-4">Total cost per month</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="oklch(var(--p))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
