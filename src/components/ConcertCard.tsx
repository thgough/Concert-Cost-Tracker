"use client";

import { Clock, DollarSign, MapPin, Sparkles } from "lucide-react";
import type { Concert } from "@/types/database";
import {
  costPerHour,
  formatCurrency,
  formatDate,
  formatNumber,
  funPointsPer100,
  getTopCostCategories,
  totalCost,
} from "@/lib/concert-metrics";
import { funBadgeClass } from "@/lib/fun-badge";
import FadeIn from "@/components/motion/FadeIn";

export default function ConcertCard({
  concert,
  index = 0,
}: {
  concert: Concert;
  index?: number;
}) {
  const total = totalCost(concert);
  const hours = Number(concert.hours_at_event);
  const cph = costPerHour(total, hours);
  const funPer100 = funPointsPer100(concert.fun_rating, total);
  const topCategories = getTopCostCategories(concert);

  return (
    <FadeIn delay={index * 0.05}>
      <article className="card bg-base-100 rounded-2xl border border-base-300 border-l-4 border-l-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="card-body p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="card-title text-lg truncate"
                title={concert.concert_name}
              >
                {concert.concert_name}
              </h3>
              <p className="text-sm opacity-80">{concert.artist}</p>
              <p className="text-sm opacity-70 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                {concert.venue} · {concert.city}, {concert.state}
              </p>
              <p className="text-xs opacity-60 mt-1">
                {formatDate(concert.concert_date)}
              </p>
            </div>
            <span
              className={`badge badge-lg shrink-0 ${funBadgeClass(concert.fun_rating)}`}
            >
              Fun: {concert.fun_rating}/10
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="stat bg-base-200 rounded-xl p-3">
              <div className="stat-title text-xs flex items-center gap-1">
                <DollarSign className="w-3 h-3" aria-hidden />
                Total cost
              </div>
              <div className="stat-value text-lg tabular-nums">
                {formatCurrency(total)}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-3">
              <div className="stat-title text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden />
                Cost / hour
              </div>
              <div className="stat-value text-lg tabular-nums">
                {formatCurrency(cph)}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-3">
              <div className="stat-title text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden />
                Fun Pts / $100
              </div>
              <div className="stat-value text-lg tabular-nums">
                {formatNumber(funPer100, 2)}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-3">
              <div className="stat-title text-xs">Distance</div>
              <div className="stat-value text-lg tabular-nums">
                {formatNumber(Number(concert.distance_from_home), 1)} mi
              </div>
            </div>
          </div>

          {topCategories.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium opacity-70 mb-2">
                Main cost categories
              </p>
              <div className="flex flex-wrap gap-2">
                {topCategories.map((cat) => (
                  <span key={cat.label} className="badge badge-outline">
                    {cat.label}: {formatCurrency(cat.amount)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {concert.notes && (
            <p className="text-sm mt-3 p-3 bg-base-200 rounded-xl opacity-90">
              <span className="font-medium">Notes: </span>
              {concert.notes}
            </p>
          )}
        </div>
      </article>
    </FadeIn>
  );
}
