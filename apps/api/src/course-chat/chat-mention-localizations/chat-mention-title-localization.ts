import type { SupportedLanguages } from "@repo/shared/";

export function getLocalizedUserMentionTitleAnnouncement(mentioningUserFullName: string) {
  const title: Record<SupportedLanguages, string> = {
    // English fallback until this optional feature is translated into Thai.
    th: `${mentioningUserFullName} mentioned you`,
    en: `${mentioningUserFullName} mentioned you`,
    pl: `${mentioningUserFullName} wspomniał o Tobie`,
    de: `${mentioningUserFullName} hat dich erwähnt`,
    lt: `${mentioningUserFullName} paminėjo jus`,
    cs: `${mentioningUserFullName} vás zmínil`,
    es: `${mentioningUserFullName} te mencionó`,
    fr: `${mentioningUserFullName} vous a mentionné(e)`,
  };
  return title;
}
