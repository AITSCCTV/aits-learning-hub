# Content management

## Current upstream capabilities

Administrators/content creators use the existing course editor for chapters, lessons and assessments. Existing file-upload and resource-library flows provide replaceable assets. Verify permissions for the intended role before using a flow; do not broaden roles to make editing convenient.

## AITS content rules

Until Matsumoto supplies approved materials, every example must carry **Sample Content — Pending Company Approval**. Thai: **เนื้อหาตัวอย่าง — รอการอนุมัติจากบริษัท**. Generic technical education is a demonstration, not an official operating procedure.

Do not invent HR entitlements, salary, benefits, safety acceptance rules or company policies. For missing materials, tell the learner that approved content is pending and direct questions to HR or a supervisor.

## Knowledge library workflow

1. Sign in as an administrator and open **Knowledge library**. Create a document, FAQ or SOP with title, language, owner, category, body and allowed roles. The saved record gets a stable source ID; include any external document reference in its body. Leave **Sample content** selected for provisional material.
2. Save the draft. Documents can receive one private PDF, DOCX or UTF-8 TXT attachment, up to 10 MB. Uploads validate actual file content. Video, slides and image lesson assets use Mentingo's existing course editor/resource library instead.
3. Submit the draft for review. An administrator may approve only a non-sample version in review. The UI's publish state and the knowledge approval state are separate.
4. To change a saved record, create a revision. This preserves its lineage and history, resets approval, and requires a fresh attachment if needed. Approval of the newest version deactivates any previously approved version atomically.
5. Deactivate obsolete versions. Learners can see role-allowed approved records or explicitly labeled samples; inactive records are hidden. Downloads recheck tenant, role and status and issue short-lived private links.
6. For SOPs, enter checklist steps as numbered lines (`1.`, `2.`). Checkboxes support reading practice only; they reset when the view is remounted and are not compliance or sign-off records.

The current workflow does not require a separate reviewer identity. Organizations requiring two-person approval need an additional rule before production use. Knowledge attachments are not automatically extracted, embedded, or passed to AI.

## Replacing a lesson placeholder

Open the native administrator course editor, select the lesson, replace its demonstration text/media, and remove its `[AITS:video]`, `[AITS:slides]`, `[AITS:pdf]`, `[AITS:text]`, `[AITS:image]`, `[AITS:faq]` or `[AITS:sop]` marker once the real material is ready. Remove the sample warning only after company approval, including from the course and lesson title/description. Review each language separately. Knowledge approval does not automatically publish or replace a course lesson.

No application-code change should be required to replace an individual material. SOP checklists are demonstrations until approved procedures and acceptance rules exist.
