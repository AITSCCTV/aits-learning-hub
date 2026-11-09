import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export const aitsKnowledgeKey = ["aits-knowledge"] as const;
export function useAitsKnowledge() {
  return useQuery({
    queryKey: aitsKnowledgeKey,
    queryFn: async () => (await ApiClient.api.aitsControllerListKnowledge()).data.data,
  });
}
