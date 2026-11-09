import { FileText, Image, ListChecks, PlayCircle, Presentation, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = {
  video: PlayCircle,
  slides: Presentation,
  pdf: FileText,
  text: FileText,
  image: Image,
  faq: HelpCircle,
  sop: ListChecks,
};
export type SampleKind = keyof typeof icons;

export function getSampleKind(content: string): SampleKind | undefined {
  const kind = content.match(/\[AITS:(video|slides|pdf|text|image|faq|sop)\]/)?.[1];
  return kind as SampleKind | undefined;
}

export function SamplePlaceholder({ kind }: { kind: SampleKind }) {
  const { t } = useTranslation();
  const Icon = icons[kind];
  return (
    <section
      className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6"
      aria-label={t("aits.placeholder")}
    >
      <div className="mb-4 flex items-center gap-3 text-blue-800">
        <Icon size={28} aria-hidden />
        <h2 className="text-lg font-semibold">{t(`aits.${kind}`)}</h2>
      </div>
      <p className="font-semibold text-amber-900">{t("aits.sample")}</p>
      <p className="mt-2 text-sm text-slate-700">{t("aits.sampleDescription")}</p>
      <p className="mt-4 text-sm text-slate-600">{t("aits.placeholderHelp")}</p>
    </section>
  );
}
