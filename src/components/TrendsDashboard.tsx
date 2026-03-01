"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useProcessingStatus } from "@/hooks/useProcessingStatus";
import { useTrends } from "@/hooks/useTrends";
import type { TrendsFilters as TrendsFiltersType } from "@/lib/types";
import { InsightsPanel } from "./InsightsPanel";
import { ProcessingPanel } from "./ProcessingPanel";
import { RankBumpChart } from "./RankBumpChart";
import { TrendsChart } from "./TrendsChart";
import { TrendsFilters } from "./TrendsFilters";

export function TrendsDashboard() {
  const { data: status } = useProcessingStatus();
  const [filters, setFilters] = useState<TrendsFiltersType>({});
  const { data: trendsData, isLoading } = useTrends(filters);

  const isCompleted = status?.status === "completed";

  if (!isCompleted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ProcessingPanel />
      </div>
    );
  }

  const chartTitle =
    [filters.category, filters.location, filters.year && String(filters.year)]
      .filter(Boolean)
      .join(" - ") || "Top Search Trends";

  const showBumpChart = filters.category && filters.location;

  return (
    <div className="space-y-6">
      {trendsData?.metadata && (
        <TrendsFilters
          filters={filters}
          metadata={trendsData.metadata}
          onFiltersChange={setFilters}
        />
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <TrendsChart data={trendsData?.data ?? []} title={chartTitle} />
            {showBumpChart &&
              trendsData?.data &&
              filters.category &&
              filters.location && (
                <RankBumpChart
                  data={trendsData.data}
                  category={filters.category}
                  location={filters.location}
                />
              )}
          </div>
          <div className="lg:col-span-1">
            <InsightsPanel filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
}
