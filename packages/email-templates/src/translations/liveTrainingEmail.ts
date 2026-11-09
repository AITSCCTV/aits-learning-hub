import type { SupportedLanguages } from "@repo/shared";

export const getLiveTrainingEmailButtonText = (language: SupportedLanguages) => {
  const translations: Record<SupportedLanguages, string> = {
    // English fallback until this optional feature is translated into Thai.
    th: "Open Live Training",
    en: "Open Live Training",
    pl: "Otwórz Szkolenie na żywo",
    de: "Live-Schulung öffnen",
    lt: "Atidaryti tiesioginius mokymus",
    cs: "Otevřít živé školení",
    es: "Abrir formación en vivo",
    fr: "Ouvrir la formation en direct",
  };

  return translations[language];
};
