import { useQuery } from "@tanstack/react-query";
import type { TrendsFilters } from "@/lib/types";
import { TrendsService } from "@/services/trends-service";

export const useTrends = (filters?: TrendsFilters) =>
  useQuery(TrendsService.getTrends(filters));
