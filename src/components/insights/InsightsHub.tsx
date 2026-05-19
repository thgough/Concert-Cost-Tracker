"use client";

import { useMemo, useState } from "react";
import type { Concert } from "@/types/database";
import {
  buildInsightMessages,
  filterByPeriod,
  type TimePeriod,
} from "@/lib/concert-metrics";
import EmptyState from "@/components/EmptyState";
import InsightCards from "@/components/insights/InsightCards";
import OverviewPanel from "@/components/insights/OverviewPanel";
import SpendingTimeline from "@/components/insights/SpendingTimeline";
import ConcertLeaderboard from "@/components/insights/ConcertLeaderboard";

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "year", label: "This year" },
  { value: "last12", label: "Last 12 months" },
];

type Tab = "overview" | "trends" | "leaderboard";

export default function InsightsHub({ concerts }: { concerts: Concert[] }) {
  const [period, setPeriod] = useState<TimePeriod>("all");
  const [tab, setTab] = useState<Tab>("overview");

  const filtered = useMemo(
    () => filterByPeriod(concerts, period),
    [concerts, period]
  );

  const insights = useMemo(
    () => buildInsightMessages(filtered),
    [filtered]
  );

  if (concerts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-80">Time period</p>
          <div className="join mt-2">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`btn btn-sm join-item ${period === p.value ? "btn-primary" : "btn-outline"}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm opacity-60">
          Showing {filtered.length} of {concerts.length} concerts
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="alert">
          <span>No concerts in this time period. Try a different filter.</span>
        </div>
      ) : (
        <>
          <InsightCards messages={insights} />

          <div role="tablist" className="tabs tabs-boxed w-full overflow-x-auto">
            {(
              [
                ["overview", "Overview"],
                ["trends", "Trends"],
                ["leaderboard", "Leaderboard"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                className={`tab ${tab === id ? "tab-active" : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && <OverviewPanel concerts={filtered} />}
          {tab === "trends" && <SpendingTimeline concerts={filtered} />}
          {tab === "leaderboard" && <ConcertLeaderboard concerts={filtered} />}
        </>
      )}
    </div>
  );
}
