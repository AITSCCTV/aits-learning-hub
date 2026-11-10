import { Link, useSearchParams } from "@remix-run/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LockKeyhole,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSaveEmployeeLearning } from "~/api/mutations/useSaveEmployeeLearning";
import { useUserSettingsSuspense } from "~/api/queries/useUserSettings";
import { RequireAuthenticatedUser } from "~/Guards/RequireAuthenticatedUser";
import { RouteGuard } from "~/Guards/RouteGuard";
import { useNavigationHistoryStore } from "~/lib/stores/navigationHistory";
import { cn } from "~/lib/utils";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";

import {
  canOpenLesson,
  employeeRoles,
  getEmployeeCourses,
  initialLearning,
} from "./employee-learning";
import { LearningLanguage } from "./EmployeeWelcome.page";

import type { EmployeeLearning } from "./employee-learning";
import "./employee-learning.css";

function actionLabel(pending: boolean, role: boolean) {
  if (pending) return "employeeWelcome.saving";
  if (role) return "employeeWelcome.startLearning";
  return "employeeWelcome.next";
}
function courseAction(count: number, total: number) {
  if (count === total) return "employeeWelcome.review";
  if (count > 0) return "employeeWelcome.resume";
  return "employeeWelcome.start";
}
function lessonIcon(done: boolean, available: boolean) {
  if (done) return <CheckCircle2 size={18} />;
  if (available) return <span className="el-dot" />;
  return <LockKeyhole size={18} />;
}
export default function EmployeeLearningPage() {
  return (
    <RequireAuthenticatedUser>
      <RouteGuard>
        <EmployeeLearningContent />
      </RouteGuard>
    </RequireAuthenticatedUser>
  );
}

export function PeopleDirectory() {
  const { t } = useTranslation();
  return (
    <>
      <span className="el-eyebrow">{t("employeeWelcome.people")}</span>
      <h1>{t("employeeWelcome.peopleTitle")}</h1>
      <p className="el-lead">{t("employeeWelcome.peopleBody")}</p>
      <div className="el-contacts">
        {["hr", "it", "account", "manager"].map((key, i) => (
          <article key={key}>
            <span className="el-contact-number">0{i + 1}</span>
            <h2>{t(`employeeWelcome.${key}Contact`)}</h2>
            <p>{t(`employeeWelcome.${key}Help`)}</p>
          </article>
        ))}
      </div>
      <p className="el-note">{t("employeeWelcome.contactNote")}</p>
    </>
  );
}

function EmployeeLearningContent() {
  const { t } = useTranslation();
  const consumeLastUnauthorizedEntry = useNavigationHistoryStore(
    (state) => state.consumeLastUnauthorizedEntry,
  );
  useEffect(() => {
    consumeLastUnauthorizedEntry();
  }, [consumeLastUnauthorizedEntry]);
  const language = useLanguageStore((state) => state.language);
  const locale = language === "en" ? "en" : "th";
  const { data: settings } = useUserSettingsSuspense();
  const progress = settings.employeeLearning ?? initialLearning;
  const { mutateAsync: save, isPending, isError } = useSaveEmployeeLearning();
  const [params, setParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(progress.role);
  const [answer, setAnswer] = useState<number | null>(null);
  const [section, setSection] = useState(0);
  const courseId = params.get("course");
  const lessonId = params.get("lesson");
  const directory = params.get("view") === "people";
  const changingRole = params.get("view") === "role";
  const courses = getEmployeeCourses(progress.role);
  const course = courses.find((item) => item.id === courseId);
  const lessonIndex = course?.lessons.findIndex((item) => item.id === lessonId) ?? -1;
  const lesson = course?.lessons[lessonIndex];
  const completed = progress.completedLessons;
  const ready = progress.stage === "ready" && !!progress.role;
  const stage = changingRole ? "role" : progress.stage;
  const stepIndex = ["company", "people", "role"].indexOf(stage);
  const total = courses.reduce((sum, item) => sum + item.lessons.length, 0);
  const done = courses
    .flatMap((item) => item.lessons)
    .filter((item) => completed.includes(item.id)).length;

  useEffect(() => {
    setSelectedRole(progress.role);
  }, [progress.role]);
  useEffect(() => {
    setAnswer(null);
    setSection(0);
  }, [courseId, lessonId]);

  async function update(next: EmployeeLearning) {
    try {
      await save(next);
      return true;
    } catch {
      return false;
    }
  }
  function openLesson(id: string, lesson: string) {
    setParams({ course: id, lesson });
  }
  async function completeLesson() {
    if (!course || !lesson || answer !== lesson.correct) return;
    const next = { ...progress, completedLessons: [...new Set([...completed, lesson.id])] };
    if (!(await update(next))) return;
    const following = course.lessons[lessonIndex + 1];
    if (following) openLesson(course.id, following.id);
    else setParams({ finished: course.id });
  }

  return (
    <main className="el el-app">
      <header className="el-top">
        <Link className="el-logo" to="/learn">
          AITS<span>Learning Hub</span>
        </Link>
        <div className="el-header-actions">
          <Link className="el-account" to="/settings">
            {t("pages.settings")}
          </Link>
          <LearningLanguage />
        </div>
      </header>
      <div className="el-content">
        {isError && (
          <p className="el-error" role="alert">
            {t("employeeWelcome.saveError")}
          </p>
        )}
        {(() => {
          if (!ready || changingRole)
            return (
              <section className="el-onboard">
                {!changingRole && (
                  <>
                    <div
                      className="el-progress"
                      role="progressbar"
                      aria-valuenow={Math.max(0, stepIndex)}
                      aria-valuemin={0}
                      aria-valuemax={3}
                      aria-label={t("employeeWelcome.learning")}
                    >
                      <span style={{ width: `${(Math.max(0, stepIndex) / 3) * 100}%` }} />
                    </div>
                    <p className="el-step">
                      {t("employeeWelcome.step", { current: stepIndex + 1, total: 3 })}
                    </p>
                  </>
                )}
                {stage === "company" && (
                  <>
                    <span className="el-medallion">
                      <Sparkles size={34} />
                    </span>
                    <span className="el-eyebrow">{t("employeeWelcome.company")}</span>
                    <h1>{t("employeeWelcome.companyTitle")}</h1>
                    <p className="el-lead">{t("employeeWelcome.companyBody")}</p>
                    <h2>{t("employeeWelcome.cultureTitle")}</h2>
                    <ul className="el-values">
                      {[1, 2, 3].map((i) => (
                        <li key={i}>
                          <CheckCircle2 size={22} />
                          {t(`employeeWelcome.culture${i}`)}
                        </li>
                      ))}
                    </ul>
                    <p className="el-note">{t("employeeWelcome.cultureNote")}</p>
                  </>
                )}
                {stage === "people" && <PeopleDirectory />}
                {stage === "role" && (
                  <>
                    <span className="el-eyebrow">{t("employeeWelcome.role")}</span>
                    <h1>{t("employeeWelcome.roleTitle")}</h1>
                    <p className="el-lead">{t("employeeWelcome.roleBody")}</p>
                    <div className="el-roles" role="group" aria-label={t("employeeWelcome.role")}>
                      {employeeRoles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          aria-pressed={selectedRole === role}
                          className={cn("el-role", { "el-selected": selectedRole === role })}
                          onClick={() => setSelectedRole(role)}
                        >
                          <span>{t(`employeeWelcome.${role}`)}</span>
                          {selectedRole === role && <Check size={20} />}
                        </button>
                      ))}
                    </div>
                    <p className="el-note">{t("employeeWelcome.roleNote")}</p>
                  </>
                )}
                <footer className="el-actions">
                  {stage !== "company" && (
                    <button
                      className="el-secondary"
                      disabled={isPending}
                      onClick={() => {
                        if (changingRole) setParams({});
                        else
                          void update({
                            ...progress,
                            stage: stage === "role" ? "people" : "company",
                          });
                      }}
                    >
                      <ArrowLeft size={18} />
                      {t("employeeWelcome.back")}
                    </button>
                  )}
                  <button
                    className="el-primary"
                    disabled={isPending || (stage === "role" && !selectedRole)}
                    onClick={async () => {
                      if (stage === "role") {
                        if (
                          selectedRole &&
                          (await update({ ...progress, role: selectedRole, stage: "ready" }))
                        )
                          setParams({});
                      } else {
                        await update({
                          ...progress,
                          stage: stage === "company" ? "people" : "role",
                        });
                      }
                    }}
                  >
                    {t(actionLabel(isPending, stage === "role"))}
                    <ArrowRight size={20} />
                  </button>
                </footer>
              </section>
            );
          if (directory)
            return (
              <section className="el-onboard">
                <PeopleDirectory />
                <button className="el-secondary" onClick={() => setParams({})}>
                  {t("employeeWelcome.backPath")}
                </button>
              </section>
            );
          if (courseId)
            return (
              <section className="el-reader">
                <button className="el-text-button" onClick={() => setParams({})}>
                  <ArrowLeft size={18} />
                  {t("employeeWelcome.backPath")}
                </button>
                {!course || !lesson || !canOpenLesson(course, lessonIndex, completed) ? (
                  <h1>{t("employeeWelcome.notAvailable")}</h1>
                ) : (
                  <>
                    <span className="el-eyebrow">
                      {course.title[locale]} · {lessonIndex + 1}/{course.lessons.length}
                    </span>
                    <h1>{lesson.title[locale]}</h1>
                    <div
                      className="el-progress"
                      role="progressbar"
                      aria-label={t("employeeWelcome.progress", { done: section, total: 3 })}
                      aria-valuenow={section}
                      aria-valuemin={0}
                      aria-valuemax={3}
                    >
                      <span style={{ width: `${(section / 3) * 100}%` }} />
                    </div>
                    {(() => {
                      if (section < 2)
                        return (
                          <article className="el-lesson-slide">
                            <span className="el-slide-number">0{section + 1}</span>
                            <p>{lesson.paragraphs[section]?.[locale]}</p>
                            <footer className="el-actions">
                              {section > 0 && (
                                <button
                                  className="el-secondary"
                                  onClick={() => setSection(section - 1)}
                                >
                                  {t("employeeWelcome.back")}
                                </button>
                              )}
                              <button
                                className="el-primary"
                                onClick={() => setSection(section + 1)}
                              >
                                {t("employeeWelcome.next")}
                                <ArrowRight size={18} />
                              </button>
                            </footer>
                          </article>
                        );
                      if (section === 2)
                        return (
                          <article className="el-lesson-slide">
                            <h2>{t("employeeWelcome.keyPoints")}</h2>
                            <ul className="el-values">
                              {lesson.points.map((point, i) => (
                                <li key={i}>
                                  <CheckCircle2 size={20} />
                                  {point[locale]}
                                </li>
                              ))}
                            </ul>
                            <h2>{t("employeeWelcome.example")}</h2>
                            <p>{lesson.example[locale]}</p>
                            <footer className="el-actions">
                              <button className="el-secondary" onClick={() => setSection(1)}>
                                {t("employeeWelcome.back")}
                              </button>
                              <button className="el-primary" onClick={() => setSection(3)}>
                                {t("employeeWelcome.check")}
                                <ArrowRight size={18} />
                              </button>
                            </footer>
                          </article>
                        );
                      return (
                        <article className="el-lesson-slide">
                          <h2>{lesson.question[locale]}</h2>
                          <div
                            className="el-answers"
                            role="group"
                            aria-label={t("employeeWelcome.choose")}
                          >
                            {lesson.options.map((option, i) => (
                              <button
                                key={i}
                                className={cn("el-role", { "el-selected": answer === i })}
                                aria-pressed={answer === i}
                                onClick={() => setAnswer(i)}
                              >
                                {option[locale]}
                              </button>
                            ))}
                          </div>
                          {answer !== null && (
                            <div
                              className={cn("el-feedback", {
                                "el-correct": answer === lesson.correct,
                              })}
                              role="status"
                            >
                              <strong>
                                {t(
                                  answer === lesson.correct
                                    ? "employeeWelcome.correct"
                                    : "employeeWelcome.retry",
                                )}
                              </strong>
                              {answer === lesson.correct && <p>{lesson.feedback[locale]}</p>}
                            </div>
                          )}
                          <footer className="el-actions">
                            <button className="el-secondary" onClick={() => setSection(2)}>
                              {t("employeeWelcome.back")}
                            </button>
                            <button
                              className="el-primary"
                              disabled={isPending || answer !== lesson.correct}
                              onClick={() => void completeLesson()}
                            >
                              {t(isPending ? "employeeWelcome.saving" : "employeeWelcome.complete")}
                            </button>
                          </footer>
                        </article>
                      );
                    })()}
                    <p className="el-note">{t("employeeWelcome.pilot")}</p>
                    <details className="el-source">
                      <summary>{t("employeeWelcome.source")}</summary>
                      <p>{t("employeeWelcome.sourceBody")}</p>
                      <a
                        href="https://aitscctv.github.io/aits-learning-hub/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        AITS · {t("employeeWelcome.source")}
                      </a>
                    </details>
                  </>
                )}
              </section>
            );
          return (
            <section className="el-path">
              <div className="el-path-header">
                <div>
                  <span className="el-eyebrow">{t(`employeeWelcome.${progress.role}`)}</span>
                  <h1>{t("employeeWelcome.learning")}</h1>
                  <p>{t("employeeWelcome.progress", { done, total })}</p>
                </div>
                <div className="el-path-tools">
                  <button className="el-secondary" onClick={() => setParams({ view: "people" })}>
                    <Users size={18} />
                    {t("employeeWelcome.directory")}
                  </button>
                  <button className="el-text-button" onClick={() => setParams({ view: "role" })}>
                    {t("employeeWelcome.changeRole")}
                  </button>
                </div>
              </div>
              <div
                className="el-progress"
                role="progressbar"
                aria-label={t("employeeWelcome.learning")}
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={total}
              >
                <span style={{ width: `${(done / Math.max(1, total)) * 100}%` }} />
              </div>
              {params.get("finished") && (
                <div className="el-feedback el-correct" role="status">
                  <CheckCircle2 />
                  <strong>{t("employeeWelcome.courseComplete")}</strong>
                </div>
              )}
              {[false, true].map((specialised) => (
                <section key={String(specialised)}>
                  <h2 className="el-section-title">
                    {t(specialised ? "employeeWelcome.forRole" : "employeeWelcome.essentials")}
                  </h2>
                  <div className="el-course-grid">
                    {courses
                      .filter((item) => Boolean(item.roles.length) === specialised)
                      .map((item) => {
                        const count = item.lessons.filter((l) => completed.includes(l.id)).length;
                        const next =
                          item.lessons.find((l) => !completed.includes(l.id)) ?? item.lessons[0];
                        return (
                          <article className="el-course" key={item.id}>
                            <div className="el-course-top">
                              <BookOpen size={26} />
                              <span>
                                {count}/{item.lessons.length}
                              </span>
                            </div>
                            <h3>{item.title[locale]}</h3>
                            <p>
                              {t("employeeWelcome.lessonCount", { count: item.lessons.length })}
                            </p>
                            <ol>
                              {item.lessons.map((l, i) => (
                                <li key={l.id}>
                                  <button
                                    disabled={!canOpenLesson(item, i, completed)}
                                    onClick={() => openLesson(item.id, l.id)}
                                  >
                                    {lessonIcon(
                                      completed.includes(l.id),
                                      canOpenLesson(item, i, completed),
                                    )}
                                    <span>{l.title[locale]}</span>
                                  </button>
                                </li>
                              ))}
                            </ol>
                            <button
                              className="el-primary"
                              onClick={() => openLesson(item.id, next.id)}
                            >
                              {t(courseAction(count, item.lessons.length))}
                              <ArrowRight size={18} />
                            </button>
                          </article>
                        );
                      })}
                  </div>
                </section>
              ))}
              <p className="el-note">{t("employeeWelcome.pilot")}</p>
            </section>
          );
        })()}
      </div>
    </main>
  );
}
