"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  GitCompare,
  ListMusic,
  PlusCircle,
  LogOut,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ThemeSelector from "@/components/ThemeSelector";
import FadeIn from "@/components/motion/FadeIn";

type AppShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Insights", shortLabel: "Insights", icon: BarChart3 },
  { href: "/compare", label: "Compare", shortLabel: "Compare", icon: GitCompare },
  { href: "/concerts", label: "Concerts", shortLabel: "Shows", icon: ListMusic },
  { href: "/add", label: "Add", shortLabel: "Add", icon: PlusCircle },
  { href: "/budget", label: "Budget", shortLabel: "Budget", icon: Wallet },
];

export default function AppShell({ userEmail, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Concert Cost Tracker
              </h1>
              <p className="text-sm opacity-70 mt-1">
                Track what you spend, rate the fun, and see what shows were worth
                it.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <ThemeSelector />
              <div className="text-sm opacity-80 hidden sm:block max-w-[12rem] truncate">
                Signed in as <span className="font-medium">{userEmail}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm gap-1 active:scale-[0.98] transition-transform"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" aria-hidden />
                Log out
              </button>
            </div>
          </div>
          <p className="text-xs opacity-60 mt-2 sm:hidden truncate">{userEmail}</p>

          {/* Desktop tabs */}
          <div
            role="tablist"
            className="tabs tabs-boxed mt-4 w-full overflow-x-auto flex-nowrap hidden md:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                className={`tab whitespace-nowrap gap-2 ${
                  pathname === item.href ? "tab-active" : ""
                }`}
              >
                <item.icon className="w-4 h-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <FadeIn key={pathname}>{children}</FadeIn>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="btm-nav btm-nav-md md:hidden bg-base-100 border-t border-base-300 z-40"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active text-primary" : ""}
            >
              <item.icon className="w-5 h-5" aria-hidden />
              <span className="btm-nav-label text-xs">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
