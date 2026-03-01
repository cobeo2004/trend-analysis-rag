import { getQueryClient } from "@/lib/query";
import { TrendsService } from "@/services/trends-service";
import { TrendsView } from "@/views/TrendsView";

export async function TrendsScreen() {
  const qc = getQueryClient();
  await Promise.all([
    qc.prefetchQuery(TrendsService.getProcessingStatus()),
    qc.prefetchQuery(TrendsService.getTrends({})),
  ]);
  return <TrendsView />;
}
