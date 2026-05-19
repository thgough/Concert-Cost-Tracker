import PageHeader from "@/components/PageHeader";
import { SkeletonStatCard } from "@/components/ui/SkeletonCard";

export default function BudgetLoading() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Budget"
        subtitle="Set a yearly concert budget and track spending against your goal."
      />
      <div className="skeleton h-48 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    </div>
  );
}
