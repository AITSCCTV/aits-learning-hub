import {
  ArrowLeft,
  ArrowRight,
  Check,
  CirclePlay,
  MonitorPlay,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "~/lib/utils";

import { calculatePoeLoad, visualLessons } from "./visual-learning.data";
import "./visual-learning.css";

import type { Bilingual, VisualLesson } from "./visual-learning.data";

function Pair({ text }: { text: Bilingual }) {
  return (
    <>
      <span lang="en">{text.en}</span>
      <span lang="th" className="vl-th">
        {text.th}
      </span>
    </>
  );
}

function PoeLab() {
  const { t } = useTranslation();
  const [cameras, setCameras] = useState(4);
  const [watts, setWatts] = useState(12);
  const [budget, setBudget] = useState(60);
  const result = calculatePoeLoad(cameras, watts, budget);
  return (
    <section className="vl-lab" aria-label={t("visualLearning.lab")}>
      <h4>
        <Network size={18} aria-hidden />
        {t("visualLearning.lab")}
      </h4>
      <div className="vl-inputs">
        <label>
          {t("visualLearning.cameras")}
          <input
            type="number"
            min="1"
            max="1000"
            value={cameras}
            onChange={(e) => setCameras(Number(e.target.value))}
          />
        </label>
        <label>
          {t("visualLearning.watts")}
          <input
            type="number"
            min="1"
            max="1000"
            value={watts}
            onChange={(e) => setWatts(Number(e.target.value))}
          />
        </label>
        <label>
          {t("visualLearning.budget")}
          <input
            type="number"
            min="1"
            max="10000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </label>
      </div>
      <output aria-live="polite">
        {result ? (
          <>
            <strong>
              {result.total} W / {budget} W
            </strong>
            <span>{t(result.fits ? "visualLearning.fits" : "visualLearning.over")}</span>
          </>
        ) : (
          t("visualLearning.invalid")
        )}
      </output>
      <p>{t("visualLearning.labNote")}</p>
    </section>
  );
}

function LessonPlayer({
  lesson,
  completed,
  onComplete,
  onClose,
  onNext,
}: {
  lesson: VisualLesson;
  completed: boolean;
  onComplete: () => void;
  onClose: () => void;
  onNext?: () => void;
}) {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [play, setPlay] = useState(false);
  const current = lesson.slides[slide];
  const correct = answer === lesson.correct;
  if (!current) return null;
  return (
    <div className="vl-player">
      <div className="vl-player-head">
        <button className="vl-text-button" onClick={onClose}>
          <ArrowLeft size={16} aria-hidden />
          {t("visualLearning.backPath")}
        </button>
        <span>{t("visualLearning.practiceOnly")}</span>
      </div>
      <div className="vl-player-grid">
        <div className="vl-lesson-main">
          <div className="vl-slide" key={`${lesson.id}-${slide}`} aria-live="polite">
            <div className="vl-slide-label">
              <span>AITS / LEARNING HUB</span>
              <span>
                0{slide + 1} / 0{lesson.slides.length}
              </span>
            </div>
            <h3>
              <Pair text={current.title} />
            </h3>
            <div className="vl-diagram" aria-label={t("visualLearning.diagram")}>
              {lesson.diagram.map((node, i) => (
                <div className="vl-node" key={node.en}>
                  <span className="vl-node-number">0{i + 1}</span>
                  <Pair text={node} />
                </div>
              ))}
            </div>
            <p className="vl-slide-body">
              <Pair text={current.body} />
            </p>
          </div>
          <div className="vl-slide-nav">
            <button
              onClick={() => setSlide((n) => n - 1)}
              disabled={slide === 0}
              aria-label={t("visualLearning.previous")}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              {lesson.slides.map((s, i) => (
                <button
                  key={s.title.en}
                  className={cn("vl-dot", i === slide && "is-current")}
                  aria-label={`${t("visualLearning.slide")} ${i + 1}`}
                  aria-pressed={i === slide}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide((n) => n + 1)}
              disabled={slide === lesson.slides.length - 1}
              aria-label={t("visualLearning.next")}
            >
              <ArrowRight size={20} />
            </button>
          </div>
          {lesson.video && (
            <section className="vl-video">
              <div className="vl-section-heading">
                <CirclePlay size={20} aria-hidden />
                <h4>{t("visualLearning.watch")}</h4>
                <span>{lesson.video.publisher}</span>
              </div>
              {play ? (
                <iframe
                  title={lesson.video.title}
                  src={`https://www.youtube-nocookie.com/embed/${lesson.video.id}?rel=0`}
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button className="vl-video-cover" onClick={() => setPlay(true)}>
                  <CirclePlay size={48} aria-hidden />
                  <span>{lesson.video.title}</span>
                  <small>{t("visualLearning.loadVideo")}</small>
                </button>
              )}
              <p>{t("visualLearning.videoNote")}</p>
              <a
                href={`https://www.youtube.com/watch?v=${lesson.video.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("visualLearning.openYoutube")} ↗
              </a>
            </section>
          )}
          {lesson.id === "cctv" && <PoeLab />}
          <details className="vl-sources">
            <summary>{t("visualLearning.sources")}</summary>
            <p>{t("visualLearning.sourceNote")}</p>
            {lesson.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                {source.title} ↗
              </a>
            ))}
          </details>
        </div>
        <aside className="vl-practice">
          <span className="vl-eyebrow">{t("visualLearning.yourTurn")}</span>
          <h3>
            <Pair text={lesson.question} />
          </h3>
          <fieldset>
            <legend className="sr-only">{t("visualLearning.chooseAnswer")}</legend>
            {lesson.options.map((option, i) => (
              <label key={option.en} className={cn("vl-answer", answer === i && "is-selected")}>
                <input
                  type="radio"
                  name={`answer-${lesson.id}`}
                  checked={answer === i}
                  onChange={() => {
                    setAnswer(i);
                    setChecked(false);
                  }}
                />
                <Pair text={option} />
              </label>
            ))}
          </fieldset>
          <button
            className="vl-primary"
            disabled={answer === null}
            onClick={() => {
              setChecked(true);
              if (correct) onComplete();
            }}
          >
            {t("visualLearning.check")}
          </button>
          {checked && (
            <div className={cn("vl-feedback", correct && "is-correct")} role="status">
              <strong>{t(correct ? "visualLearning.correct" : "visualLearning.retry")}</strong>
              <p>
                <Pair text={lesson.feedback} />
              </p>
            </div>
          )}
          {completed && (
            <div className="vl-complete">
              <Check size={18} aria-hidden />
              {t("visualLearning.complete")}
            </div>
          )}
          {completed && onNext && (
            <button className="vl-primary" onClick={onNext}>
              {t("visualLearning.nextLesson")}
              <ArrowRight size={17} aria-hidden />
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function VisualLearning({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [interest, setInterest] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const storageKey = `aits-visual-practice-v1:${userId}`;
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      setDone(
        Array.isArray(saved?.done)
          ? saved.done.filter((id: unknown) => visualLessons.some((l) => l.id === id))
          : [],
      );
      setStarted(saved?.started === true);
    } catch {
      setStorageUnavailable(true);
    }
    setLoaded(true);
  }, [storageKey]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ done, started }));
    } catch {
      setStorageUnavailable(true);
    }
  }, [done, started, storageKey, loaded]);
  const lesson = visualLessons.find((l) => l.id === active);
  const next = visualLessons.find((l) => l.id !== active && !done.includes(l.id));
  const progress = Math.round((done.length / visualLessons.length) * 100);
  function openLesson(id: string) {
    setActive(id);
    document.getElementById("visual-learning")?.scrollIntoView({ block: "start" });
  }
  return (
    <section className="vl" id="visual-learning" aria-label={t("visualLearning.title")}>
      <header className={cn("vl-hero", started && "is-compact")}>
        <div className="vl-hero-top">
          <span className="vl-eyebrow">AITS / LEARNING EXPERIENCE</span>
          <span className="vl-language">EN + ไทย</span>
        </div>
        <h2>
          <span lang="en">
            Small steps.
            <br /> Real confidence.
          </span>
          <span className="vl-hero-th" lang="th">
            เรียนทีละก้าว มั่นใจในการทำงาน
          </span>
        </h2>
        <p>{t("visualLearning.intro")}</p>
        <div className="vl-hero-bottom">
          <span>
            <MonitorPlay size={17} aria-hidden />
            {t("visualLearning.formats")}
          </span>
          <span>
            <ShieldCheck size={17} aria-hidden />
            {t("visualLearning.draft")}
          </span>
        </div>
      </header>
      {!started && (
        <div className="vl-onboarding">
          <div>
            <span className="vl-eyebrow">01 / {t("visualLearning.personalize")}</span>
            <h3>{t("visualLearning.interest")}</h3>
            <p>{t("visualLearning.interestNote")}</p>
          </div>
          <div className="vl-interests">
            {["all", "technical", "customer"].map((value) => (
              <button
                key={value}
                className={cn("vl-interest", interest === value && "is-selected")}
                aria-pressed={interest === value}
                onClick={() => setInterest(value)}
              >
                {t(`visualLearning.${value}`)}
              </button>
            ))}
          </div>
          <button
            className="vl-primary"
            onClick={() => {
              setStarted(true);
              const id = interest === "technical" ? "cctv" : "welcome";
              openLesson(interest === "customer" ? "service" : id);
            }}
          >
            {t("visualLearning.begin")}
            <ArrowRight size={17} aria-hidden />
          </button>
        </div>
      )}
      {started && (
        <>
          <div className="vl-progress-row">
            <div>
              <span className="vl-eyebrow">{t("visualLearning.path")}</span>
              <h3>
                {done.length} / 7 <span>{t("visualLearning.steps")}</span>
              </h3>
            </div>
            <div
              className="vl-progress"
              role="progressbar"
              aria-label={t("visualLearning.path")}
              aria-valuenow={done.length}
              aria-valuemin={0}
              aria-valuemax={7}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          {!lesson && (
            <div className="vl-cards">
              {visualLessons.map((item, i) => (
                <button
                  key={item.id}
                  className={cn("vl-card", done.includes(item.id) && "is-done")}
                  onClick={() => openLesson(item.id)}
                >
                  <span className="vl-card-top">
                    <span className="vl-card-number">
                      {done.includes(item.id) ? (
                        <Check size={24} aria-hidden />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <ArrowRight size={20} aria-hidden />
                  </span>
                  <h3>
                    <Pair text={item.title} />
                  </h3>
                  <p>
                    <Pair text={item.subtitle} />
                  </p>
                  <span className="vl-card-meta">
                    {t("visualLearning.cardFormat")}
                    {item.video && <CirclePlay size={16} aria-label={t("visualLearning.watch")} />}
                  </span>
                </button>
              ))}
            </div>
          )}
          {lesson && (
            <LessonPlayer
              key={lesson.id}
              lesson={lesson}
              completed={done.includes(lesson.id)}
              onComplete={() =>
                setDone((previous) =>
                  previous.includes(lesson.id) ? previous : [...previous, lesson.id],
                )
              }
              onClose={() => setActive(null)}
              onNext={next ? () => openLesson(next.id) : undefined}
            />
          )}
          {done.length === 7 && !lesson && (
            <div className="vl-celebration">
              <Sparkles aria-hidden />
              <h3>{t("visualLearning.finished")}</h3>
              <p>{t("visualLearning.finishedNote")}</p>
            </div>
          )}
        </>
      )}
      <footer className="vl-footer">
        <p>
          {t(storageUnavailable ? "visualLearning.sessionOnly" : "visualLearning.localProgress")}
        </p>
        <a
          href="https://www.youtube.com/channel/UC3-unZ3F-KTDlcefKlbbw0A"
          target="_blank"
          rel="noreferrer"
        >
          {t("visualLearning.thaiVideos")} ↗
        </a>
      </footer>
    </section>
  );
}
