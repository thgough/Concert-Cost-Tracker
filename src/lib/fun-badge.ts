export function funBadgeClass(rating: number): string {
  if (rating <= 4) return "badge-neutral";
  if (rating <= 7) return "badge-warning";
  return "badge-success";
}
