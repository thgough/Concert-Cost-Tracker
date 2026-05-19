import PageHeader from "@/components/PageHeader";

export default function CompareLoading() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Compare"
        subtitle="Pick any two shows and see how cost, fun, and value stack up."
      />
      <div className="skeleton h-40 rounded-2xl" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}
