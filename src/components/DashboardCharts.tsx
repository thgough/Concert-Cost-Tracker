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
import {
  formatCurrency,
  formatNumber,
  funPointsPer100,
  getCategoryTotals,
  totalCost,
  truncateLabel,
} from "@/lib/concert-metrics";
import FadeIn from "@/components/motion/FadeIn";

const BAR_ANIMATION = { isAnimationActive: true, animationDuration: 800 };

export default function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) {
    return (
      <p className="text-center opacity-70 py-8">
        Add concerts to see charts here.
      </p>
    );
  }

  const categoryData = getCategoryTotals(concerts).map((c) => ({
    name: c.name,
    amount: c.total,
  }));

  const byConcert = concerts.map((c) => {
    const total = totalCost(c);
    return {
      name: truncateLabel(c.concert_name),
      fullName: c.concert_name,
      total,
      fun: c.fun_rating,
      funPer100: funPointsPer100(c.fun_rating, total),
    };
  });

  return (
    <FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Spending by cost category"
          subtitle="Combined across all your shows"
        >
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
                {...BAR_ANIMATION}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Total cost by concert"
          subtitle="How much each show cost you"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={byConcert}
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
              <Tooltip
                formatter={(v) => formatCurrency(Number(v ?? 0))}
                labelFormatter={(label, payload) =>
                  (payload?.[0]?.payload as { fullName?: string })?.fullName ??
                  label
                }
              />
              <Bar
                dataKey="total"
                fill="oklch(var(--s))"
                radius={[4, 4, 0, 0]}
                {...BAR_ANIMATION}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Fun rating by concert"
          subtitle="Your score from 1 to 10"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={byConcert}
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
              <YAxis domain={[0, 10]} />
              <Tooltip
                labelFormatter={(label, payload) =>
                  (payload?.[0]?.payload as { fullName?: string })?.fullName ??
                  label
                }
              />
              <Bar
                dataKey="fun"
                fill="oklch(var(--a))"
                radius={[4, 4, 0, 0]}
                {...BAR_ANIMATION}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Fun Points per $100 by concert"
          subtitle="Higher means better value for money"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={byConcert}
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
              <YAxis />
              <Tooltip
                formatter={(v) => formatNumber(Number(v ?? 0), 2)}
                labelFormatter={(label, payload) =>
                  (payload?.[0]?.payload as { fullName?: string })?.fullName ??
                  label
                }
              />
              <Bar
                dataKey="funPer100"
                fill="oklch(var(--su))"
                radius={[4, 4, 0, 0]}
                {...BAR_ANIMATION}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </FadeIn>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 rounded-2xl shadow-sm border border-base-300">
      <div className="card-body p-5 sm:p-6">
        <h3 className="card-title text-base">{title}</h3>
        <p className="text-xs opacity-60 -mt-1 mb-2">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
