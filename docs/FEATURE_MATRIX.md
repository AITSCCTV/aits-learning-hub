# Mentingo / AITS feature matrix

Runtime evidence is recorded in SETUP_LOG.md; browser acceptance remains pending.

| Requirement | Reused Mentingo capability | AITS implementation / status |
| --- | --- | --- |
| Login and sessions | JWT cookies, permissions, tenant guards | Five synthetic accounts; authenticated HTTPS checks pass |
| Employee dashboard | Statistics and progress | Actual completion and stored metrics checked |
| Courses and assignments | Courses, chapters, lessons, enrollment | Sixteen labeled EN/TH courses, 48 assignments; native editor retained |
| Assessments | Questions, attempts and grading | Sample single-choice/true-false quiz scored 100%; persisted completion checked |
| Materials | File validators, uploads, resource library | Replaceable lesson placeholders; private knowledge attachments |
| Managers | Group-scoped report permission | Two assigned learners visible; unrelated employee excluded |
| FAQ and SOP | Document storage and tenant database | Versioned FAQ/SOP records; reading checklist without compliance claims |
| Knowledge documents | Existing documents metadata, S3 | Validated extension with owner, roles, review, versions and deactivation; no schema migration needed |
| AI mentor | Existing AI and ingestion infrastructure | AITS setup-required screen; no provider calls or automatic ingestion |
| AI budgets | Existing token/tracing surfaces | Enforceable budgets and cost estimates deferred before AI activation |
| Localization | Shared language contract and i18next | Thai added; core learner labels translated, English fallbacks elsewhere |
| Branding | Tenant settings and logo component | AITS name and text identity; no unapproved corporate logo copied |

Knowledge approval is independent of course publication. Adding an AI key does not activate approved-document retrieval automatically. The manager retains the original restricted permission set.

## Demonstration acceptance evidence

| # | Criterion | Evidence / remaining check |
| --- | --- | --- |
| 1 | Documented startup | Compiled API startup with migrations verified; Windows commands documented |
| 2 | Demo login | Admin, learner and manager HTTPS sessions verified |
| 3 | Course browsing | Assigned-course/lesson API records verified; browser pending |
| 4 | Open lessons | Authenticated lesson details verified |
| 5 | Media placeholders | Component tests pass; visual rendering pending |
| 6 | Sample quizzes | Native quiz submission scored 100%, 2/2 |
| 7 | Stored progress | Native completion persisted and dashboard reports one completed course |
| 8 | Admin create/edit | Native course creation and edit verified through API |
| 9 | Assign courses | Native administrator enrollment verified through API |
| 10 | Replace materials | TXT/PDF/DOCX upload/download and native lesson text replacement passed; browser check pending |
| 11 | Permissions | Manager group scope, learner/admin separation and knowledge authorization checked |
| 12 | Thai/English | Language contracts, sample content and core translations implemented; editorial/browser review pending |
| 13 | Desktop/mobile | Blocked by disabled local browser control; not accepted |
| 14 | AI or setup state | Explicit setup-required page, no simulated answers |
| 15 | Sample labeling | Bilingual warning on samples; sample approval rejected |
| 16 | Build/test/setup | Production builds, focused tests, typechecks and lint passed; see dated log for later fixes |

