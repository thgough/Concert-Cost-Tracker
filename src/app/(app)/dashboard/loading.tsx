import PageHeader from "@/components/PageHeader";
import {
  SkeletonChartCard,
  SkeletonStatCard,
} from "@/components/ui/SkeletonCard";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Insights"
        subtitle="Filters, trends, and highlights from your concert history."
      />
      <div className="skeleton h-10 w-full max-w-md rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton h-10 w-72 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <SkeletonChartCard />
    </div>
  );
}
