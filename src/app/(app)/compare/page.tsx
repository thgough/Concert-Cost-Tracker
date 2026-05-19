import ConcertCompare from "@/components/compare/ConcertCompare";
import PageHeader from "@/components/PageHeader";
import { getConcerts } from "@/lib/get-concerts";

export default async function ComparePage() {
  const concerts = await getConcerts();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Compare"
        subtitle="Pick any two shows and see how cost, fun, and value stack up."
      />
      <ConcertCompare concerts={concerts} />
    </div>
  );
}
