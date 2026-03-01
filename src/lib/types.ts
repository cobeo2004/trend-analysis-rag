export interface TrendRow {
  id: number;
  location: string;
  year: number;
  category: string;
  rank: number;
  query: string;
}

export interface TrendsFilters {
  year?: number;
  category?: string;
  location?: string;
}

export interface TrendsMetadata {
  locations: string[];
  categories: string[];
  years: number[];
}

export interface TrendsResponse {
  data: TrendRow[];
  metadata: TrendsMetadata;
}

export interface ProcessingStatusData {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  total: number;
  processed: number;
  error: string | null;
}
