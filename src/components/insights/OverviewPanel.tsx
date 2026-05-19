"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Concert } from "@/types/database";
import { formatCurrency, getCategoryTotals } from "@/lib/concert-metrics";
import DashboardStats from "@/components/DashboardStats";

export default function OverviewPanel({ concerts }: { concerts: Concert[] }) {
  const categoryData = getCategoryTotals(concerts).map((c) => ({
    name: c.name,
    amount: c.total,
  }));

  return (
    <div className="space-y-8">
      <DashboardStats concerts={concerts} />
      {categoryData.length > 0 && (
        <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <h3 className="card-title text-base">Spending by cost category</h3>
            <p className="text-xs opacity-60 -mt-1 mb-4">Combined for selected period</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={categoryData}
                margin={{ top: 8, right: 8, left: 0, bottom: 72 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                <Bar
                  dataKey="amount"
                  fill="oklch(var(--p))"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
