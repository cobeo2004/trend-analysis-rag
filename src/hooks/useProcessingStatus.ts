import { useQuery } from "@tanstack/react-query";
import { TrendsService } from "@/services/trends-service";

export const useProcessingStatus = () =>
  useQuery({
    ...TrendsService.getProcessingStatus(),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "processing" || status === "pending") return 2000;
      return false;
    },
  });
