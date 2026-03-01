import { queryOptions } from "@tanstack/react-query";
import type {
  ProcessingStatusData,
  TrendsFilters,
  TrendsResponse,
} from "@/lib/types";

// biome-ignore lint/complexity/noStaticOnlyClass: convention for service classes
export class TrendsService {
  static getTrends(filters?: TrendsFilters) {
    const params = new URLSearchParams();
    if (filters?.year) params.set("year", String(filters.year));
    if (filters?.category) params.set("category", filters.category);
    if (filters?.location) params.set("location", filters.location);

    return queryOptions({
      queryKey: ["trends", filters],
      queryFn: async () => {
        const response = await fetch(`/api/trends?${params.toString()}`);
        return response.json() as Promise<TrendsResponse>;
      },
    });
  }

  static getProcessingStatus() {
    return queryOptions({
      queryKey: ["processing-status"],
      queryFn: async () => {
        const response = await fetch("/api/process");
        return response.json() as Promise<ProcessingStatusData>;
      },
    });
  }
}
