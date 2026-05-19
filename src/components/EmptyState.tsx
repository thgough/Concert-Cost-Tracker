import Link from "next/link";
import { Music, Plus } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

export default function EmptyState() {
  return (
    <FadeIn>
      <div className="hero min-h-[40vh] bg-base-100 rounded-2xl border border-base-300 shadow-sm">
        <div className="hero-content text-center py-12">
          <div className="max-w-md">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-5">
                <Music className="w-12 h-12 text-primary" aria-hidden />
              </div>
            </div>
            <h2 className="text-xl font-bold">No concerts yet</h2>
            <p className="py-3 opacity-80">
              No concerts logged yet. Add your first concert to start seeing your
              dashboard.
            </p>
            <p className="text-sm opacity-60 pb-6">
              Takes about 2 minutes to add your first show.
            </p>
            <Link
              href="/add"
              className="btn btn-primary btn-lg gap-2 active:scale-[0.98] transition-transform"
            >
              <Plus className="w-5 h-5" aria-hidden />
              Add your first concert
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
