"use client";

import { useMemo, useState } from "react";
import type { Concert } from "@/types/database";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  funPointsPer100,
  sortConcerts,
  totalCost,
  type LeaderboardSortKey,
} from "@/lib/concert-metrics";

type SortDir = "asc" | "desc";

export default function ConcertLeaderboard({
  concerts,
}: {
  concerts: Concert[];
}) {
  const [sortKey, setSortKey] = useState<LeaderboardSortKey>("concert_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(
    () => sortConcerts(concerts, sortKey, sortDir),
    [concerts, sortKey, sortDir]
  );

  function toggleSort(key: LeaderboardSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function header(label: string, key: LeaderboardSortKey) {
    const active = sortKey === key;
    return (
      <button
        type="button"
        className={`font-semibold text-left hover:text-primary ${active ? "text-primary" : ""}`}
        onClick={() => toggleSort(key)}
      >
        {label} {active ? (sortDir === "asc" ? "↑" : "↓") : ""}
      </button>
    );
  }

  return (
    <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>{header("Concert", "concert_name")}</th>
            <th>{header("Date", "concert_date")}</th>
            <th className="text-right">{header("Total", "total")}</th>
            <th className="text-right">{header("Fun", "fun")}</th>
            <th className="text-right">{header("Fun/$100", "funPer100")}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => {
            const total = totalCost(c);
            return (
              <tr key={c.id}>
                <td className="font-medium max-w-[10rem] truncate" title={c.concert_name}>
                  {c.concert_name}
                </td>
                <td>{formatDate(c.concert_date)}</td>
                <td className="text-right tabular-nums">{formatCurrency(total)}</td>
                <td className="text-right tabular-nums">{c.fun_rating}/10</td>
                <td className="text-right tabular-nums">
                  {formatNumber(funPointsPer100(c.fun_rating, total), 2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
