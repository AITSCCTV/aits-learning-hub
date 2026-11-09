import { SUPPORTED_LANGUAGES } from "@repo/shared";

import type { SupportedLanguages } from "@repo/shared";

export const COURSE_DUPLICATION_COPY_SUFFIX: Record<SupportedLanguages, string> = {
    // English fallback until this optional feature is translated into Thai.
    th: "(Copy)",
  [SUPPORTED_LANGUAGES.EN]: "(Copy)",
  [SUPPORTED_LANGUAGES.PL]: "(Kopia)",
  [SUPPORTED_LANGUAGES.DE]: "(Kopie)",
  [SUPPORTED_LANGUAGES.LT]: "(Kopija)",
  [SUPPORTED_LANGUAGES.CS]: "(Kopie)",
  [SUPPORTED_LANGUAGES.ES]: "(Copia)",
  [SUPPORTED_LANGUAGES.FR]: "(Copie)",
};
