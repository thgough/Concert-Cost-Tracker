"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Target, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Concert, UserBudget } from "@/types/database";
import type { UserBudgetInsert } from "@/types/database";
import {
  formatCurrency,
  getBudgetStatus,
  getConcertsInYear,
  getYearlySpent,
  totalCost,
} from "@/lib/concert-metrics";
import MoneyInput from "@/components/MoneyInput";

type BudgetGoalsProps = {
  concerts: Concert[];
  budget: UserBudget | null;
  userId: string;
};

export default function BudgetGoals({
  concerts,
  budget,
  userId,
}: BudgetGoalsProps) {
  const router = useRouter();
  const supabase = createClient();
  const currentYear = new Date().getFullYear();

  const [yearlyBudget, setYearlyBudget] = useState(
    budget ? String(budget.yearly_budget) : ""
  );
  const [budgetYear, setBudgetYear] = useState(
    budget?.budget_year ?? currentYear
  );
  const [loading, setLoading] = useState(false);

  const spent = useMemo(
    () => getYearlySpent(concerts, budgetYear),
    [concerts, budgetYear]
  );

  const budgetNum = Number(yearlyBudget) || 0;
  const { status, percentUsed, remaining } = getBudgetStatus(spent, budgetNum);

  const yearConcerts = useMemo(
    () => getConcertsInYear(concerts, budgetYear),
    [concerts, budgetYear]
  );

  const paceInsight = useMemo(() => {
    if (!budgetNum || budgetNum <= 0 || yearConcerts.length === 0) return null;
    const avgPerConcert =
      yearConcerts.reduce((s, c) => s + totalCost(c), 0) / yearConcerts.length;
    if (avgPerConcert <= 0 || remaining <= 0) return null;
    const moreShows = Math.floor(remaining / avgPerConcert);
    return `At your current pace of ${formatCurrency(avgPerConcert)} per concert, you can afford about ${moreShows} more show${moreShows === 1 ? "" : "s"} this year.`;
  }, [budgetNum, yearConcerts, remaining]);

  const statusLabel =
    status === "none"
      ? "Set a budget to track progress"
      : status === "under"
        ? "Under budget — nice work!"
        : status === "on_track"
          ? "Getting close — watch your spending"
          : "Over budget for this year";

  const progressClass =
    status === "over"
      ? "progress-error"
      : status === "on_track"
        ? "progress-warning"
        : "progress-primary";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (budgetNum <= 0) {
      toast.error("Enter a yearly budget greater than zero.");
      return;
    }

    setLoading(true);
    const row: UserBudgetInsert = {
      user_id: userId,
      yearly_budget: budgetNum,
      budget_year: budgetYear,
    };

    const { error } = await supabase.from("user_budgets").upsert([row]);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Budget goal saved.");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
        <div className="card-body p-5 sm:p-6 space-y-4">
          <h2 className="card-title text-lg gap-2">
            <Target className="w-5 h-5 text-primary" aria-hidden />
            Set your goal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Yearly concert budget</span>
              <MoneyInput
                id="yearly-budget"
                value={yearlyBudget}
                onChange={setYearlyBudget}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Budget year</span>
              <input
                type="number"
                className="input input-bordered w-full tabular-nums"
                min={2000}
                max={2100}
                value={budgetYear}
                onChange={(e) => setBudgetYear(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save budget"
            )}
          </button>
        </div>
      </form>

      {budgetNum > 0 && (
        <>
          <div className="card bg-base-100 rounded-2xl border border-base-300 shadow-sm">
            <div className="card-body p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="font-semibold">{budgetYear} progress</h3>
                <span className="text-sm opacity-70">{statusLabel}</span>
              </div>
              <progress
                className={`progress w-full h-4 ${progressClass}`}
                value={Math.min(percentUsed, 100)}
                max={100}
              />
              <p className="text-sm mt-2 tabular-nums opacity-80">
                {formatCurrency(spent)} of {formatCurrency(budgetNum)} used (
                {percentUsed.toFixed(0)}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat bg-base-100 rounded-2xl border border-base-300 p-4">
              <div className="stat-title text-xs">Budget</div>
              <div className="stat-value text-lg tabular-nums">
                {formatCurrency(budgetNum)}
              </div>
            </div>
            <div className="stat bg-base-100 rounded-2xl border border-base-300 p-4">
              <div className="stat-title text-xs">Spent</div>
              <div className="stat-value text-lg tabular-nums">
                {formatCurrency(spent)}
              </div>
            </div>
            <div className="stat bg-base-100 rounded-2xl border border-base-300 p-4">
              <div className="stat-title text-xs">Remaining</div>
              <div
                className={`stat-value text-lg tabular-nums ${remaining < 0 ? "text-error" : ""}`}
              >
                {formatCurrency(Math.abs(remaining))}
                {remaining < 0 ? " over" : ""}
              </div>
            </div>
            <div className="stat bg-base-100 rounded-2xl border border-base-300 p-4">
              <div className="stat-title text-xs">% used</div>
              <div className="stat-value text-lg tabular-nums">
                {spent > budgetNum
                  ? `${((spent / budgetNum) * 100).toFixed(0)}%`
                  : `${percentUsed.toFixed(0)}%`}
              </div>
            </div>
          </div>

          {paceInsight && (
            <div className="alert bg-base-100 border border-primary/20">
              <TrendingUp className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-sm">{paceInsight}</span>
            </div>
          )}

          <p className="text-sm opacity-60">
            {yearConcerts.length} concert{yearConcerts.length === 1 ? "" : "s"}{" "}
            logged in {budgetYear}.
          </p>
        </>
      )}
    </div>
  );
}
