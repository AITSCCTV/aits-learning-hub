import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { aitsKnowledgeKey } from "../queries/useAitsKnowledge";
import { queryClient } from "../queryClient";
import { getTranslatedApiErrorMessage } from "../utils/getTranslatedApiErrorMessage";

import type { TransitionKnowledgeBody } from "../generated-api";

export function useTransitionAitsKnowledge() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: TransitionKnowledgeBody["action"] }) =>
      ApiClient.api.aitsControllerTransitionKnowledge(id, { action }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aitsKnowledgeKey });
      toast({ description: t("aits.saved") });
    },
    onError: (error) =>
      toast({
        variant: "destructive",
        description: getTranslatedApiErrorMessage(error, t, t("aits.error")),
      }),
  });
}
