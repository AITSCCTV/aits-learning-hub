import { Link } from "@remix-run/react";
import { BookOpen, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

export default function AitsMentorPage() {
  const { t } = useTranslation();
  return (
    <PageWrapper breadcrumbs={[{ title: t("aits.mentor"), href: "/aits-mentor" }]}>
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 md:p-10">
        <ShieldCheck className="mb-5 text-blue-700" size={40} aria-hidden />
        <h1 className="text-2xl font-semibold">{t("aits.setupRequired")}</h1>
        <p className="mt-4 leading-7 text-slate-600">{t("aits.setupDescription")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/knowledge">
              <BookOpen className="mr-2 size-4" aria-hidden />
              {t("aits.knowledge")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/courses">{t("aits.catalog")}</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
