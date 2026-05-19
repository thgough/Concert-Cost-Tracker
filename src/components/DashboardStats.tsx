"use client";

import type { Concert } from "@/types/database";
import {
  computeDashboardStats,
  formatCurrency,
  formatNumber,
  funPointsPer100,
  totalCost,
} from "@/lib/concert-metrics";
import StaggerChildren, { StaggerItem } from "@/components/motion/StaggerChildren";

function StatCard({
  title,
  value,
  small = false,
}: {
  title: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
      <div className="card-body p-4">
        <p className="text-xs opacity-70 font-medium">{title}</p>
        <p
          className={`font-bold tabular-nums mt-1 leading-tight ${
            small ? "text-base" : "text-2xl"
          }`}
          title={small ? value : undefined}
        >
          <span className={small ? "line-clamp-2" : ""}>{value}</span>
        </p>
      </div>
    </div>
  );
}

export default function DashboardStats({ concerts }: { concerts: Concert[] }) {
  const stats = computeDashboardStats(concerts);

  const bestValueLabel = stats.bestValue
    ? `${stats.bestValue.concert_name} (${formatNumber(
        funPointsPer100(stats.bestValue.fun_rating, totalCost(stats.bestValue)),
        2
      )} pts)`
    : "—";

  const mostExpensiveLabel = stats.mostExpensive
    ? `${stats.mostExpensive.concert_name} (${formatCurrency(totalCost(stats.mostExpensive))})`
    : "—";

  const highestFunLabel = stats.highestFun
    ? `${stats.highestFun.concert_name} (${stats.highestFun.fun_rating}/10)`
    : "—";

  const overview = [
    { title: "Total concerts", value: String(stats.totalConcerts) },
    { title: "Total spent", value: formatCurrency(stats.totalSpent) },
    {
      title: "Avg cost / concert",
      value: formatCurrency(stats.avgCostPerConcert),
    },
    {
      title: "Avg fun rating",
      value: stats.totalConcerts
        ? formatNumber(stats.avgFunRating, 1)
        : "—",
    },
    {
      title: "Avg cost / hour",
      value: formatCurrency(stats.avgCostPerHour),
    },
  ];

  const highlights = [
    { title: "Best value", value: bestValueLabel, small: true },
    { title: "Most expensive", value: mostExpensiveLabel, small: true },
    { title: "Highest fun", value: highestFunLabel, small: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Overview</h3>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overview.map((card) => (
            <StaggerItem key={card.title}>
              <StatCard title={card.title} value={card.value} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">Highlights</h3>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((card) => (
            <StaggerItem key={card.title}>
              <StatCard
                title={card.title}
                value={card.value}
                small={card.small}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
