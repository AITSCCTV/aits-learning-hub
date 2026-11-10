import { SUPPORTED_LANGUAGES } from "@repo/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isSupportedLanguage } from "../../../../utils/browser-language";

import type { SupportedLanguages } from "@repo/shared";

type LanguageStore = {
  language: SupportedLanguages;
  setLanguage: (lang: SupportedLanguages) => void;
  initializeLanguage: (applicationLang?: string | null) => SupportedLanguages;
};

function getDefaultLanguage(): SupportedLanguages {
  return SUPPORTED_LANGUAGES.TH;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: getDefaultLanguage(),
      setLanguage: (lang) => set({ language: lang }),
      initializeLanguage: (applicationLang) => {
        const currentState = get();

        if (applicationLang && isSupportedLanguage(applicationLang)) {
          set({ language: applicationLang });
          return applicationLang;
        }

        if (currentState.language && isSupportedLanguage(currentState.language)) {
          return currentState.language;
        }

        const browserLang = getDefaultLanguage();
        set({ language: browserLang });
        return browserLang;
      },
    }),
    {
      name: "language-storage",
    },
  ),
);
