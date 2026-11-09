import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { aitsKnowledgeKey } from "../queries/useAitsKnowledge";
import { queryClient } from "../queryClient";
import { getTranslatedApiErrorMessage } from "../utils/getTranslatedApiErrorMessage";

export function useUploadAitsKnowledge() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      ApiClient.api.aitsControllerUploadKnowledge(id, { file }),
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
