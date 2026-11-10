import { useTranslation } from "react-i18next";

/** Reactive translated copy for shared primitives without their own translation hook. */
export function LocalizedText({ textKey }: { textKey: string }) {
  const { t } = useTranslation();
  return <>{t(textKey)}</>;
}
