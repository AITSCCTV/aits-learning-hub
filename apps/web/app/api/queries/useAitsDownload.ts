import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export function useAitsDownload(id: string) {
  return useQuery({
    queryKey: ["aits-download", id],
    queryFn: async () => (await ApiClient.api.aitsControllerDownloadKnowledge(id)).data.data.url,
    enabled: false,
    staleTime: 0,
  });
}
