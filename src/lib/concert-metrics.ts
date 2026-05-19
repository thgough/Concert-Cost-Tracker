import type { Concert } from "@/types/database";

export type CostFields = Pick<
  Concert,
  | "ticket_cost"
  | "ticket_fees"
  | "parking_cost"
  | "food_drink_cost"
  | "merchandise_cost"
  | "lodging_cost"
  | "travel_cost"
  | "other_cost"
>;

export type TimePeriod = "all" | "year" | "last12";

export const COST_CATEGORIES = [
  { key: "ticket_cost" as const, label: "Tickets" },
  { key: "ticket_fees" as const, label: "Ticket fees" },
  { key: "parking_cost" as const, label: "Parking" },
  { key: "food_drink_cost" as const, label: "Food & drink" },
  { key: "merchandise_cost" as const, label: "Merchandise" },
  { key: "lodging_cost" as const, label: "Lodging" },
  { key: "travel_cost" as const, label: "Travel / gas" },
  { key: "other_cost" as const, label: "Other" },
];

export function parseConcertDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function filterByPeriod(
  concerts: Concert[],
  period: TimePeriod
): Concert[] {
  if (period === "all") return concerts;

  const now = new Date();
  const currentYear = now.getFullYear();

  if (period === "year") {
    return concerts.filter(
      (c) => parseConcertDate(c.concert_date).getFullYear() === currentYear
    );
  }

  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 12);
  return concerts.filter((c) => parseConcertDate(c.concert_date) >= cutoff);
}

export function totalCost(concert: CostFields): number {
  return (
    Number(concert.ticket_cost) +
    Number(concert.ticket_fees) +
    Number(concert.parking_cost) +
    Number(concert.food_drink_cost) +
    Number(concert.merchandise_cost) +
    Number(concert.lodging_cost) +
    Number(concert.travel_cost) +
    Number(concert.other_cost)
  );
}

export function costPerHour(total: number, hours: number): number {
  if (!hours || hours <= 0) return 0;
  return total / hours;
}

export function funPointsPer100(funRating: number, total: number): number {
  if (!total || total <= 0) return 0;
  return (funRating / total) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return parseConcertDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function getTopCostCategories(
  concert: Concert,
  limit = 3
): { label: string; amount: number }[] {
  return COST_CATEGORIES.map(({ key, label }) => ({
    label,
    amount: Number(concert[key]),
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export type CategoryTotal = { name: string; total: number };

export function getCategoryTotals(concerts: Concert[]): CategoryTotal[] {
  return COST_CATEGORIES.map(({ key, label }) => ({
    name: label,
    total: concerts.reduce((sum, c) => sum + Number(c[key]), 0),
  })).filter((c) => c.total > 0);
}

export type MonthlySpending = { month: string; label: string; total: number };

export function getMonthlySpending(concerts: Concert[]): MonthlySpending[] {
  const byMonth = new Map<string, number>();

  concerts.forEach((c) => {
    const d = parseConcertDate(c.concert_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + totalCost(c));
  });

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => {
      const [y, m] = month.split("-").map(Number);
      const label = new Date(y, m - 1, 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return { month, label, total };
    });
}

export function buildInsightMessages(concerts: Concert[]): string[] {
  if (concerts.length === 0) return [];

  const stats = computeDashboardStats(concerts);
  const messages: string[] = [
    `You've logged ${stats.totalConcerts} concert${stats.totalConcerts === 1 ? "" : "s"} and spent ${formatCurrency(stats.totalSpent)} total.`,
  ];

  const categories = getCategoryTotals(concerts);
  if (categories.length > 0) {
    messages.push(
      `${categories[0].name} is your biggest category at ${formatCurrency(categories[0].total)}.`
    );
  }

  if (stats.bestValue) {
    const fp = funPointsPer100(
      stats.bestValue.fun_rating,
      totalCost(stats.bestValue)
    );
    messages.push(
      `Your best value show was "${stats.bestValue.concert_name}" at ${formatNumber(fp, 2)} Fun Points per $100.`
    );
  }

  if (stats.avgFunRating >= 8) {
    messages.push("You're having a great run — your average fun rating is 8 or higher!");
  } else if (stats.avgFunRating <= 5 && stats.totalConcerts >= 2) {
    messages.push("Your average fun rating is on the lower side. Maybe try a smaller venue or favorite artist next?");
  }

  return messages;
}

export type LeaderboardSortKey =
  | "concert_name"
  | "concert_date"
  | "total"
  | "fun"
  | "funPer100";

export function sortConcerts(
  concerts: Concert[],
  key: LeaderboardSortKey,
  direction: "asc" | "desc"
): Concert[] {
  const sorted = [...concerts].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "concert_name":
        cmp = a.concert_name.localeCompare(b.concert_name);
        break;
      case "concert_date":
        cmp = a.concert_date.localeCompare(b.concert_date);
        break;
      case "total":
        cmp = totalCost(a) - totalCost(b);
        break;
      case "fun":
        cmp = a.fun_rating - b.fun_rating;
        break;
      case "funPer100":
        cmp =
          funPointsPer100(a.fun_rating, totalCost(a)) -
          funPointsPer100(b.fun_rating, totalCost(b));
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export type DashboardStats = {
  totalConcerts: number;
  totalSpent: number;
  avgCostPerConcert: number;
  avgFunRating: number;
  avgCostPerHour: number;
  bestValue: Concert | null;
  mostExpensive: Concert | null;
  highestFun: Concert | null;
};

export function computeDashboardStats(concerts: Concert[]): DashboardStats {
  if (concerts.length === 0) {
    return {
      totalConcerts: 0,
      totalSpent: 0,
      avgCostPerConcert: 0,
      avgFunRating: 0,
      avgCostPerHour: 0,
      bestValue: null,
      mostExpensive: null,
      highestFun: null,
    };
  }

  const totals = concerts.map((c) => totalCost(c));
  const totalSpent = totals.reduce((a, b) => a + b, 0);
  const costPerHours = concerts.map((c) =>
    costPerHour(totalCost(c), Number(c.hours_at_event))
  );
  const funPoints = concerts.map((c) =>
    funPointsPer100(c.fun_rating, totalCost(c))
  );

  let bestIdx = 0;
  let expensiveIdx = 0;
  let funIdx = 0;

  concerts.forEach((_, i) => {
    if (funPoints[i] > funPoints[bestIdx]) bestIdx = i;
    if (totals[i] > totals[expensiveIdx]) expensiveIdx = i;
    if (concerts[i].fun_rating > concerts[funIdx].fun_rating) funIdx = i;
  });

  return {
    totalConcerts: concerts.length,
    totalSpent,
    avgCostPerConcert: totalSpent / concerts.length,
    avgFunRating:
      concerts.reduce((s, c) => s + c.fun_rating, 0) / concerts.length,
    avgCostPerHour:
      costPerHours.reduce((a, b) => a + b, 0) / concerts.length,
    bestValue: concerts[bestIdx],
    mostExpensive: concerts[expensiveIdx],
    highestFun: concerts[funIdx],
  };
}

export function truncateLabel(label: string, max = 18): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}

export type MetricDelta = {
  label: string;
  valueA: number;
  valueB: number;
  delta: number;
  formattedA: string;
  formattedB: string;
  formattedDelta: string;
  higherIsBetter?: boolean;
};

export type ConcertComparison = {
  concertA: Concert;
  concertB: Concert;
  metrics: MetricDelta[];
  categories: {
    label: string;
    amountA: number;
    amountB: number;
    delta: number;
  }[];
};

export function compareConcerts(a: Concert, b: Concert): ConcertComparison {
  const totalA = totalCost(a);
  const totalB = totalCost(b);
  const hoursA = Number(a.hours_at_event);
  const hoursB = Number(b.hours_at_event);
  const cphA = costPerHour(totalA, hoursA);
  const cphB = costPerHour(totalB, hoursB);
  const fpA = funPointsPer100(a.fun_rating, totalA);
  const fpB = funPointsPer100(b.fun_rating, totalB);

  const metrics: MetricDelta[] = [
    {
      label: "Total cost",
      valueA: totalA,
      valueB: totalB,
      delta: totalB - totalA,
      formattedA: formatCurrency(totalA),
      formattedB: formatCurrency(totalB),
      formattedDelta: formatCurrency(Math.abs(totalB - totalA)),
      higherIsBetter: false,
    },
    {
      label: "Fun rating",
      valueA: a.fun_rating,
      valueB: b.fun_rating,
      delta: b.fun_rating - a.fun_rating,
      formattedA: `${a.fun_rating}/10`,
      formattedB: `${b.fun_rating}/10`,
      formattedDelta: `${Math.abs(b.fun_rating - a.fun_rating)} pts`,
      higherIsBetter: true,
    },
    {
      label: "Cost per hour",
      valueA: cphA,
      valueB: cphB,
      delta: cphB - cphA,
      formattedA: formatCurrency(cphA),
      formattedB: formatCurrency(cphB),
      formattedDelta: formatCurrency(Math.abs(cphB - cphA)),
      higherIsBetter: false,
    },
    {
      label: "Fun Points per $100",
      valueA: fpA,
      valueB: fpB,
      delta: fpB - fpA,
      formattedA: formatNumber(fpA, 2),
      formattedB: formatNumber(fpB, 2),
      formattedDelta: formatNumber(Math.abs(fpB - fpA), 2),
      higherIsBetter: true,
    },
    {
      label: "Distance (mi)",
      valueA: Number(a.distance_from_home),
      valueB: Number(b.distance_from_home),
      delta: Number(b.distance_from_home) - Number(a.distance_from_home),
      formattedA: formatNumber(Number(a.distance_from_home), 1),
      formattedB: formatNumber(Number(b.distance_from_home), 1),
      formattedDelta: formatNumber(
        Math.abs(Number(b.distance_from_home) - Number(a.distance_from_home)),
        1
      ),
    },
    {
      label: "Hours at event",
      valueA: hoursA,
      valueB: hoursB,
      delta: hoursB - hoursA,
      formattedA: formatNumber(hoursA, 1),
      formattedB: formatNumber(hoursB, 1),
      formattedDelta: formatNumber(Math.abs(hoursB - hoursA), 1),
    },
  ];

  const categories = COST_CATEGORIES.map(({ key, label }) => {
    const amountA = Number(a[key]);
    const amountB = Number(b[key]);
    return { label, amountA, amountB, delta: amountB - amountA };
  }).filter((c) => c.amountA > 0 || c.amountB > 0);

  return { concertA: a, concertB: b, metrics, categories };
}

export function getYearlySpent(concerts: Concert[], year: number): number {
  return concerts
    .filter((c) => parseConcertDate(c.concert_date).getFullYear() === year)
    .reduce((sum, c) => sum + totalCost(c), 0);
}

export type BudgetStatus = "none" | "under" | "on_track" | "over";

export function getBudgetStatus(
  spent: number,
  budget: number
): { status: BudgetStatus; percentUsed: number; remaining: number } {
  if (!budget || budget <= 0) {
    return { status: "none", percentUsed: 0, remaining: 0 };
  }
  const percentUsed = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  let status: BudgetStatus = "under";
  if (spent > budget) status = "over";
  else if (percentUsed >= 85) status = "on_track";
  return { status, percentUsed, remaining };
}

export function getConcertsInYear(concerts: Concert[], year: number): Concert[] {
  return concerts.filter(
    (c) => parseConcertDate(c.concert_date).getFullYear() === year
  );
}
