"use client";

import { useMemo, useState } from "react";
import { GitCompare } from "lucide-react";
import type { Concert } from "@/types/database";
import { compareConcerts, formatDate } from "@/lib/concert-metrics";
import ConcertCard from "@/components/ConcertCard";
import ComparisonMetrics from "@/components/compare/ComparisonMetrics";
import EmptyState from "@/components/EmptyState";

function concertLabel(c: Concert): string {
  return `${c.concert_name} (${formatDate(c.concert_date)})`;
}

export default function ConcertCompare({ concerts }: { concerts: Concert[] }) {
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");

  const concertA = concerts.find((c) => c.id === idA);
  const concertB = concerts.find((c) => c.id === idB);

  const comparison = useMemo(() => {
    if (!concertA || !concertB || concertA.id === concertB.id) return null;
    return compareConcerts(concertA, concertB);
  }, [concertA, concertB]);

  if (concerts.length === 0) {
    return <EmptyState />;
  }

  if (concerts.length < 2) {
    return (
      <div className="alert">
        <span>Log at least two concerts to compare them side by side.</span>
      </div>
    );
  }

  const optionsB = concerts.filter((c) => c.id !== idA);
  const optionsA = concerts.filter((c) => c.id !== idB);

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
        <div className="card-body p-5 sm:p-6">
          <h2 className="card-title text-lg gap-2">
            <GitCompare className="w-5 h-5 text-primary" aria-hidden />
            Pick two shows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <label className="form-control w-full">
              <span className="label-text font-medium">Concert A</span>
              <select
                className="select select-bordered w-full"
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
              >
                <option value="">Select a concert…</option>
                {optionsA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {concertLabel(c)}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Concert B</span>
              <select
                className="select select-bordered w-full"
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
              >
                <option value="">Select a concert…</option>
                {optionsB.map((c) => (
                  <option key={c.id} value={c.id}>
                    {concertLabel(c)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {!concertA || !concertB ? (
        <p className="text-center opacity-70 py-6">
          Choose two different concerts above to see a side-by-side comparison.
        </p>
      ) : concertA.id === concertB.id ? (
        <p className="text-center text-warning py-6">
          Pick two different concerts to compare.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Concert A</p>
              <ConcertCard concert={concertA} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary mb-2">Concert B</p>
              <ConcertCard concert={concertB} />
            </div>
          </div>
          {comparison && <ComparisonMetrics comparison={comparison} />}
        </>
      )}
    </div>
  );
}
