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
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
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
