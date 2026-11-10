import { Link, Navigate } from "@remix-run/react";
import { ArrowRight, Check, Compass, Users, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useChangeLanguage } from "~/api/mutations/useChangeLanguage";
import { useCurrentUser } from "~/api/queries/useCurrentUser";
import { cn } from "~/lib/utils";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";
import "./employee-learning.css";

export function LearningLanguage() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { data: user } = useCurrentUser();
  const { mutate: changeLanguage, isPending } = useChangeLanguage();
  function choose(language: "th" | "en") {
    if (user) changeLanguage({ language });
    else setLanguage(language);
  }
  return (
    <div className="el-language" aria-label="Language / ภาษา">
      <button
        type="button"
        aria-pressed={language === "th"}
        disabled={isPending}
        onClick={() => choose("th")}
      >
        ไทย
      </button>
      <button
        type="button"
        aria-pressed={language === "en"}
        disabled={isPending}
        onClick={() => choose("en")}
      >
        English
      </button>
    </div>
  );
}
export default function EmployeeWelcomePage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useCurrentUser();
  if (user) return <Navigate to="/learn" replace />;
  return (
    <main className="el el-welcome">
      <header className="el-top">
        <Link className="el-logo" to="/">
          AITS<span>Learning Hub</span>
        </Link>
        <LearningLanguage />
      </header>
      <div className="el-welcome-grid">
        <section className="el-intro">
          <span className="el-eyebrow">{t("employeeWelcome.brand")}</span>
          <h1>{t("employeeWelcome.welcomeTitle")}</h1>
          <p>{t("employeeWelcome.welcomeBody")}</p>
          <Link className={cn("el-primary", { "el-disabled": isLoading })} to="/auth/login">
            {t("employeeWelcome.login")}
            <ArrowRight size={20} />
          </Link>
          <small>{t("employeeWelcome.returning")}</small>
        </section>
        <section className="el-journey" aria-label={t("employeeWelcome.learning")}>
          <div className="el-spark">
            <Sparkles size={42} />
          </div>
          {[Compass, Users, Check].map((Icon, index) => (
            <div className="el-journey-stop" key={index}>
              <span>
                <Icon size={25} />
              </span>
              <div>
                <small>0{index + 1}</small>
                <h2>{t(`employeeWelcome.${["companyStep", "peopleStep", "roleStep"][index]}`)}</h2>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
