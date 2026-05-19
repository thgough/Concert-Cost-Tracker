import PageHeader from "@/components/PageHeader";
import { SkeletonConcertCard } from "@/components/ui/SkeletonCard";

export default function ConcertsLoading() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="My Concerts"
        subtitle="Every show you have logged, newest first."
      />
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonConcertCard key={i} />
        ))}
      </div>
    </div>
  );
}
