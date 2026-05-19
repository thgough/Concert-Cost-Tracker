export function SkeletonStatCard() {
  return (
    <div className="card bg-base-100 border border-base-300 rounded-2xl">
      <div className="card-body p-4 gap-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-8 w-32" />
      </div>
    </div>
  );
}

export function SkeletonConcertCard() {
  return (
    <div className="card bg-base-100 border border-base-300 rounded-2xl">
      <div className="card-body p-6 gap-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-4 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="card bg-base-100 border border-base-300 rounded-2xl">
      <div className="card-body p-6">
        <div className="skeleton h-5 w-40 mb-4" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
