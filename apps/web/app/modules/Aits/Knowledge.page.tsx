import { hasPermission, PERMISSIONS, SUPPORTED_LANGUAGES, SYSTEM_ROLE_SLUGS } from "@repo/shared";
import { BookOpen, FileCheck, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSaveAitsKnowledge } from "~/api/mutations/useSaveAitsKnowledge";
import { useTransitionAitsKnowledge } from "~/api/mutations/useTransitionAitsKnowledge";
import { useUploadAitsKnowledge } from "~/api/mutations/useUploadAitsKnowledge";
import { useAitsDownload } from "~/api/queries/useAitsDownload";
import { useAitsKnowledge } from "~/api/queries/useAitsKnowledge";
import { useCurrentUser } from "~/api/queries/useCurrentUser";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";

import { SopChecklist } from "./SopChecklist";

import type { CreateKnowledgeBody, ListKnowledgeResponse } from "~/api/generated-api";

type Record = ListKnowledgeResponse["data"][number];

function Attachment({ record }: { record: Record }) {
  const { t } = useTranslation();
  const { refetch, isFetching, isError } = useAitsDownload(record.id);
  return (
    <div>
      <Button
        variant="outline"
        disabled={isFetching}
        onClick={async () => {
          const result = await refetch();
          if (result.data) window.location.assign(result.data);
        }}
      >
        {record.fileName}
      </Button>
      {isError && <p role="alert">{t("aits.error")}</p>}
    </div>
  );
}

function KnowledgeEditor({ record, onClose }: { record?: Record; onClose: () => void }) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const [form, setForm] = useState<CreateKnowledgeBody>(() => ({
    title: record?.title ?? "",
    body: record?.body ?? "",
    owner: record?.owner ?? "",
    category: record?.category ?? "",
    kind: record?.kind ?? "document",
    sample: record?.sample ?? true,
    language: record?.language ?? language,
    roles: record?.roles ?? [
      SYSTEM_ROLE_SLUGS.STUDENT,
      SYSTEM_ROLE_SLUGS.GROUP_MANAGER,
      SYSTEM_ROLE_SLUGS.ADMIN,
    ],
  }));
  const { mutateAsync: save, isPending } = useSaveAitsKnowledge();
  return (
    <form
      className="mb-8 space-y-4 rounded-xl border bg-white p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await save({ id: record?.id, body: form });
          onClose();
        } catch {
          /* Mutation hook displays the error; keep the draft. */
        }
      }}
    >
      <h2 className="text-xl font-semibold">{t(record ? "aits.edit" : "aits.newRecord")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {(["title", "owner", "category"] as const).map((field) => (
          <label className="grid gap-2" key={field}>
            {t(field === "title" ? "aits.recordTitle" : `aits.${field}`)}
            <Input
              required
              maxLength={field === "title" ? 250 : 200}
              value={form[field]}
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            />
          </label>
        ))}
        <label className="grid gap-2">
          {t("common.lessonTypes.content")}
          <select
            className="rounded-lg border p-2"
            value={form.kind}
            onChange={(event) =>
              setForm({ ...form, kind: event.target.value as CreateKnowledgeBody["kind"] })
            }
          >
            {(["document", "faq", "sop"] as const).map((kind) => (
              <option key={kind} value={kind}>
                {t(`aits.${kind}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          {t("changeUserLanguageView.field.language")}
          <select
            className="rounded-lg border p-2"
            value={form.language}
            onChange={(event) =>
              setForm({ ...form, language: event.target.value as CreateKnowledgeBody["language"] })
            }
          >
            {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
              <option key={lang} value={lang}>
                {t(`common.languages.${lang}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        {t("aits.body")}
        <Textarea
          required
          maxLength={50000}
          rows={8}
          value={form.body}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
        />
      </label>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.sample}
          onChange={(event) => setForm({ ...form, sample: event.target.checked })}
        />
        {t("aits.sampleLabel")}
      </label>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-2">{t("aits.roles")}</legend>
        {Object.values(SYSTEM_ROLE_SLUGS).map((role) => (
          <label key={role} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.roles.includes(role)}
              onChange={(event) =>
                setForm({
                  ...form,
                  roles: event.target.checked
                    ? [...form.roles, role]
                    : form.roles.filter((value) => value !== role),
                })
              }
            />
            {t(
              `common.roles.${{ admin: "admin", student: "student", group_manager: "groupManager", content_creator: "contentCreator", trainer: "trainer" }[role]}`,
            )}
          </label>
        ))}
      </fieldset>
      <div className="flex gap-3">
        <Button disabled={isPending || !form.roles.length}>{t("aits.save")}</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.button.cancel")}
        </Button>
      </div>
    </form>
  );
}

export default function KnowledgePage() {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const { data: user } = useCurrentUser();
  const { data: records = [], isPending, isError, refetch } = useAitsKnowledge();
  const { mutate: transition, isPending: transitioning } = useTransitionAitsKnowledge();
  const { mutate: upload, isPending: uploading } = useUploadAitsKnowledge();
  const [editor, setEditor] = useState<Record | "new" | null>(null);
  const [kind, setKind] = useState("all");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState(false);
  const admin = hasPermission(user?.permissions, PERMISSIONS.SETTINGS_MANAGE);
  const latest = new Map<string, number>();
  for (const record of records)
    latest.set(record.lineageId, Math.max(latest.get(record.lineageId) ?? 0, record.version));
  const visible = records.filter(
    (record) =>
      (history || record.version === latest.get(record.lineageId)) &&
      (admin || record.language === language) &&
      (kind === "all" || record.kind === kind) &&
      `${record.title} ${record.category}`
        .toLocaleLowerCase(language)
        .includes(search.toLocaleLowerCase(language)),
  );
  return (
    <PageWrapper breadcrumbs={[{ title: t("aits.knowledge"), href: "/knowledge" }]}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <BookOpen className="text-blue-700" aria-hidden />
            {t("aits.knowledge")}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{t("aits.sampleDescription")}</p>
        </div>
        {admin && (
          <Button onClick={() => setEditor("new")}>
            <Plus className="mr-2 size-4" aria-hidden />
            {t("aits.newRecord")}
          </Button>
        )}
      </div>
      {admin && editor && (
        <KnowledgeEditor
          key={editor === "new" ? "new" : editor.id}
          record={editor === "new" ? undefined : editor}
          onClose={() => setEditor(null)}
        />
      )}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          className="max-w-sm"
          aria-label={t("common.other.search")}
          placeholder={t("common.other.search")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="rounded-lg border bg-white p-2"
          aria-label={t("aits.category")}
          value={kind}
          onChange={(event) => setKind(event.target.value)}
        >
          {["all", "document", "faq", "sop"].map((value) => (
            <option key={value} value={value}>
              {t(`aits.${value}`)}
            </option>
          ))}
        </select>
        {admin && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={history}
              onChange={(event) => setHistory(event.target.checked)}
            />
            {t("aits.history")}
          </label>
        )}
      </div>
      {isPending && <p role="status">{t("aits.loading")}</p>}
      {isError && (
        <div role="alert">
          <p>{t("aits.error")}</p>
          <Button onClick={() => void refetch()}>{t("dashboardHome.error.retry")}</Button>
        </div>
      )}
      {!isPending && !isError && !visible.length && (
        <p className="rounded-xl border bg-white p-10 text-center">{t("aits.empty")}</p>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((record) => (
          <article key={record.id} className="min-w-0 rounded-xl border bg-white p-6">
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-blue-50 px-2 py-1 text-blue-800">
                {t(`aits.${record.kind}`)}
              </span>
              <span className="rounded bg-slate-100 px-2 py-1">
                {t(`aits.${record.state}`)} · {t("aits.version")}{" "}
                {new Intl.NumberFormat(language).format(record.version)}
              </span>
              <span>{record.language.toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-semibold">{record.title}</h2>
            {record.sample && (
              <p className="mt-3 rounded bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                {t("aits.sample")}
              </p>
            )}
            <p className="my-3 text-sm text-slate-600">
              {record.category} · {t("aits.owner")}: {record.owner}
            </p>
            {record.kind === "sop" ? (
              <SopChecklist key={record.id} content={record.body} />
            ) : (
              <p className="whitespace-pre-wrap break-words leading-7">{record.body}</p>
            )}
            {record.kind === "sop" && (
              <p className="mt-4 text-sm text-slate-600">{t("aits.noCompliance")}</p>
            )}
            <p className="mt-4 break-all text-xs text-slate-500">
              {t("aits.source")}: {record.id} ·{" "}
              {new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(
                new Date(record.updatedAt),
              )}
            </p>
            {record.fileName && (
              <div className="mt-4">
                <Attachment record={record} />
              </div>
            )}
            {admin && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={record.version !== latest.get(record.lineageId)}
                  onClick={() => setEditor(record)}
                >
                  {t("aits.edit")}
                </Button>
                {record.state === "draft" && (
                  <Button
                    variant="outline"
                    disabled={transitioning}
                    onClick={() => transition({ id: record.id, action: "review" })}
                  >
                    {t("aits.review")}
                  </Button>
                )}
                {record.state === "pending" && (
                  <Button
                    disabled={transitioning || record.sample}
                    title={record.sample ? t("aits.reviewFirst") : undefined}
                    onClick={() => transition({ id: record.id, action: "approve" })}
                  >
                    <FileCheck className="mr-2 size-4" aria-hidden />
                    {t("aits.approve")}
                  </Button>
                )}
                {record.state !== "inactive" && (
                  <Button
                    variant="outline"
                    disabled={transitioning}
                    onClick={() => transition({ id: record.id, action: "deactivate" })}
                  >
                    {t("aits.deactivate")}
                  </Button>
                )}
                {record.state === "draft" && !record.fileName && (
                  <label className="mt-2 grid w-full gap-2 text-sm">
                    {t("aits.file")}
                    <Input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) upload({ id: record.id, file });
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </PageWrapper>
  );
}
