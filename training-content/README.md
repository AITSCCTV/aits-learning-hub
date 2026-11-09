# AITS Learning Hub — training review package

Version 0.1.0 · 9 November 2026 · **Draft — Pending Company Approval**

Open `index.html` for links to every course and its editable files. This is a complete introductory curriculum for company review, not approved employee policy, a technical qualification or production deployment.

## Included

| Item | Quantity |
|---|---:|
| Courses | 7 |
| Web lessons with objectives, examples, exercises and model responses | 28 |
| PowerPoint decks | 7, with 16 slides each (112 slides) |
| Course manuals | 7 DOCX and 7 PDF |
| Separate SOP template workbook | 1 DOCX and 1 PDF, containing 5 drafts |
| Original workflow diagrams | 7 SVG and 7 PNG |
| Quiz questions with answers and explanations | 84 |
| Practical scenarios with four-criterion rubrics | 21 |
| Source-aware knowledge records | 28 |

English is the primary language. Each lesson includes a Thai summary; these are AI translations awaiting native-speaker review, not full Thai course translations. Instructor explanations and references are also in PowerPoint speaker notes.

## Review sequence

1. Welcome to AITS — public company background, services, collaboration and platform orientation.
2. Employee rights and workplace fundamentals — selected Thai statutory baselines and how to distinguish law from unverified company rules.
3. Workplace safety — hazard recognition, electrical awareness, height planning and incident reporting.
4. CCTV installation fundamentals — equipment roles, PoE, site surveys, fault isolation and handover.
5. Networking and technical support — LAN/Wi-Fi, IP/DHCP/DNS and evidence-based troubleshooting.
6. Sales, customer support and administration — requirements, complaints, quotations and controlled records.
7. SOP awareness and quality assurance — document authority, deviations, quality checks and AI limits.

Plan approximately 100 minutes per course including written exercises and discussion. The LMS automatically calculated reading duration may differ. Prerequisites in the content are recommended learning order, not enforced enrollment gates. Assign technical courses according to role; the package does not establish AITS job responsibilities.

## What is already in the application

The seven additional courses were imported through authenticated native APIs into **https://aits.lms.localhost**. Each has four instructional lessons, three practice lessons and a 12-question quiz. Existing placeholder courses were preserved. Thirty downloadable resources were attached to the first lesson of each course (four per course plus the two SOP workbook formats in Course 07).

The local courses are published for demonstration, with Sample Content labels and Draft approval metadata retained. Publication makes a course visible; it does not approve its content. Twenty-eight knowledge records remain Draft/sample. Administrators can manage the lessons, questions and attachments using the existing application tools. No changes were deployed to learn.aitscctv.com.

`imports/local-receipt.json` records local course, lesson, knowledge and resource identifiers. The import script resumes creation using that receipt; it is **not an update synchronizer** and is intentionally restricted to localhost. It uses the existing local environment credential without packaging it. A production import requires adapting and reviewing the import against the target tenant and storage, after company approval. Do not delete the receipt and rerun against the same local tenant: that would create duplicates.

## Evidence and limits

- All seven native learner flows passed: lesson reads, quiz answers graded at 100%, completion persistence, a fresh authenticated dashboard and rejection of learner editing with HTTP 403.
- All imported knowledge records were checked as Draft/sample. Six offline mentor-context tests passed, including exclusion of unapproved records from company-policy context.
- All 112 slides and all 68 PDF pages were rendered and visually inspected. Deck structure/layout/import checks passed. Word exported the PDFs because the bundled DOCX renderer could not find LibreOffice; the actual Word PDF output was rasterized for inspection.
- Desktop course and lesson pages opened; the checked mobile lesson had no horizontal overflow. Browser checks recorded React hydration errors, so this is not a clean frontend regression pass. See `quality-reports/ui-check.json` and the captured screenshots. No wider application regression, concurrent-user load or production deployment test is claimed.
- The local test learner now has completion records for these courses. Scenario rubrics support human review; native quizzes are automatically graded. No live AI scoring was exercised.

## AI mentor readiness

`knowledge-base/items.json` separates source classification from approval status. A supported public company fact can still belong to a Draft training asset. Source IDs resolve through `sources/inventory.json`. Company-policy retrieval must require approved, company-authoritative, current and authorized records. Generic educational content and fictional scenarios must remain explicitly labeled.

`knowledge-base/practice-sessions.json` supplies all 21 staged practice prompts, scenario facts and scoring rubrics. `mentor_context.py` and its tests demonstrate context filtering offline; they are **not wired into the LMS AI service**. The application still requires a configured model provider/API, server-side tenant/role enforcement, approved-source retrieval, citation handling and end-to-end mentor evaluation. For missing AITS policy, the prepared behavior states the gap and refers the learner to HR or the responsible department. It does not fabricate an answer.

## Company inputs still required

| Owner to designate | Required before approval |
|---|---|
| HR / management | Current organization chart, reporting lines, job descriptions, handbook, work rules, benefits, leave administration and reporting contacts |
| HR / Thai employment specialist | Check statutory applicability, current amendments, employment categories and company rules; approve Course 02 and Thai wording |
| Safety / technical lead | Site risk assessments, emergency arrangements, authorized work boundaries, approved device manuals and acceptance criteria |
| Sales / operations | Current quotation authority, commercial terms, customer handover standards and record-handling procedures |
| SOP owners | Replace or adapt all five generic templates; assign owners, reviewers, effective dates and review dates |
| IT / application owner | Production hosting/database/storage, real user access, AI provider and approved retrieval integration; investigate frontend hydration errors |

The older Ministry of Labour overview contains obsolete maternity wording. This package uses that page only for the stated hours/rest/holiday baseline and uses the newer government amendment explanation for maternity-related changes. Full legal and company approval remains outstanding. Sources and applicability limits are recorded in the source inventory.

## Replacing a draft

Keep the stable document/course identifier, increase its version, record the reviewer and source references, revise lessons and quiz keys together, and regenerate the editable/exported files. Replace the relevant native lesson/resource through the administrator tools. Submit knowledge revisions through the existing review lifecycle; do not merely change a visible label to Approved. Archive superseded records, preserve learner-history requirements, and rerun relevant grading and approval checks. Update the manifest hashes after changing assets.

The `content-manifest.json` maps each asset to course, related lessons, version, approval status, references and SHA-256. `quality-reports/curriculum-alignment.json` maps objectives to lessons and questions. Builder scripts preserve reproducibility; the Node dependency junction and local environment files are excluded from the ZIP.
