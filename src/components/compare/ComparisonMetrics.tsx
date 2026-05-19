"use client";

import type { ConcertComparison } from "@/lib/concert-metrics";

function deltaColor(
  delta: number,
  higherIsBetter?: boolean
): string {
  if (delta === 0) return "text-base-content/60";
  const positive = delta > 0;
  const good = higherIsBetter ? positive : !positive;
  return good ? "text-success" : "text-error";
}

export default function ComparisonMetrics({
  comparison,
}: {
  comparison: ConcertComparison;
}) {
  const { metrics, categories } = comparison;

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
        <div className="card-body p-5 sm:p-6">
          <h3 className="card-title text-base">Head-to-head</h3>
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="text-right">Concert A</th>
                  <th className="text-right">Concert B</th>
                  <th className="text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.label}>
                    <td className="font-medium">{m.label}</td>
                    <td className="text-right tabular-nums">{m.formattedA}</td>
                    <td className="text-right tabular-nums">{m.formattedB}</td>
                    <td
                      className={`text-right tabular-nums font-medium ${deltaColor(m.delta, m.higherIsBetter)}`}
                    >
                      {m.delta === 0
                        ? "—"
                        : `${m.delta > 0 ? "+" : "−"}${m.formattedDelta}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <h3 className="card-title text-base">Category breakdown</h3>
            <p className="text-xs opacity-60 -mt-1 mb-4">
              Positive difference means Concert B spent more in that category.
            </p>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-right">A</th>
                    <th className="text-right">B</th>
                    <th className="text-right">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.label}>
                      <td>{c.label}</td>
                      <td className="text-right tabular-nums">
                        ${c.amountA.toFixed(2)}
                      </td>
                      <td className="text-right tabular-nums">
                        ${c.amountB.toFixed(2)}
                      </td>
                      <td
                        className={`text-right tabular-nums ${deltaColor(c.delta, false)}`}
                      >
                        {c.delta === 0
                          ? "—"
                          : `${c.delta > 0 ? "+" : "−"}$${Math.abs(c.delta).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
