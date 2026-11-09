import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { aitsKnowledgeKey } from "../queries/useAitsKnowledge";
import { queryClient } from "../queryClient";
import { getTranslatedApiErrorMessage } from "../utils/getTranslatedApiErrorMessage";

import type { CreateKnowledgeBody } from "../generated-api";

export function useSaveAitsKnowledge() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async ({ id, body }: { id?: string; body: CreateKnowledgeBody }) =>
      (id
        ? await ApiClient.api.aitsControllerReviseKnowledge(id, body)
        : await ApiClient.api.aitsControllerCreateKnowledge(body)
      ).data.data,
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
