import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ThemeToggle } from "@/components/ThemeToggle";
import { TrendsDashboard } from "@/components/TrendsDashboard";
import { getQueryClient } from "@/lib/query";

export function TrendsView() {
  const qc = getQueryClient();
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Google Search Trends Explorer
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              27K+ search trends across 84 countries (2001-2020)
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <HydrationBoundary state={dehydrate(qc)}>
          <TrendsDashboard />
        </HydrationBoundary>
      </main>
    </div>
  );
}
