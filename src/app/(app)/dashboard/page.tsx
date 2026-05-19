import DashboardCharts from "@/components/DashboardCharts";
import DashboardStats from "@/components/DashboardStats";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { getConcerts } from "@/lib/get-concerts";

export default async function DashboardPage() {
  const concerts = await getConcerts();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your concerts, spending, and fun per dollar."
      />

      {concerts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DashboardStats concerts={concerts} />
          <DashboardCharts concerts={concerts} />
        </>
      )}
    </div>
  );
}
