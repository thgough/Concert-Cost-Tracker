import ConcertForm from "@/components/ConcertForm";
import PageHeader from "@/components/PageHeader";

export default function AddConcertPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <PageHeader
        title="Add Concert"
        subtitle="Fill in the details and costs for a show you attended. Total cost is calculated automatically."
      />
      <ConcertForm />
    </div>
  );
}
