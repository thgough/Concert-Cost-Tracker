import PageHeader from "@/components/PageHeader";
import {
  SkeletonChartCard,
  SkeletonStatCard,
} from "@/components/ui/SkeletonCard";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your concerts, spending, and fun per dollar."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonChartCard key={i} />
        ))}
      </div>
    </div>
  );
}
