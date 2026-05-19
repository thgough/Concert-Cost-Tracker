import InsightsHub from "@/components/insights/InsightsHub";
import PageHeader from "@/components/PageHeader";
import { getConcerts } from "@/lib/get-concerts";

export default async function DashboardPage() {
  const concerts = await getConcerts();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Insights"
        subtitle="Filters, trends, and highlights from your concert history."
      />
      <InsightsHub concerts={concerts} />
    </div>
  );
}
