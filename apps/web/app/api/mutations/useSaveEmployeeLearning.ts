import { useMutation } from "@tanstack/react-query";

import { ApiClient } from "~/api/api-client";
import { userSettingsQueryOptions } from "~/api/queries/useUserSettings";
import { queryClient } from "~/api/queryClient";

import type { EmployeeLearning } from "~/modules/Aits/employee-learning";

export function useSaveEmployeeLearning() {
  return useMutation({
    mutationFn: async (employeeLearning: EmployeeLearning) =>
      (await ApiClient.api.settingsControllerUpdateUserSettings({ employeeLearning })).data,
    onSuccess: (response) => {
      queryClient.setQueryData(userSettingsQueryOptions.queryKey, response);
    },
  });
}
