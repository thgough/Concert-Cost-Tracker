import ConcertCard from "@/components/ConcertCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { getConcerts } from "@/lib/get-concerts";

export default async function ConcertsPage() {
  const concerts = await getConcerts();

  return (
    <div className="space-y-10">
      <PageHeader
        title="My Concerts"
        subtitle="Every show you have logged, newest first."
      />

      {concerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {concerts.map((concert, index) => (
            <ConcertCard key={concert.id} concert={concert} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
