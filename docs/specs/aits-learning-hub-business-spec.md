# AITS Learning Hub

## Business Overview

AITS employees need consistent onboarding while Matsumoto collects official materials. The extension provides clearly labeled examples within Mentingo's existing course, lesson, assessment and progress workflows. Implementation and acceptance status are recorded separately in IMPLEMENTATION_PLAN.md.

## Who Uses It

- Learners open assigned training, complete assessments and distinguish examples from approved company information.
- HR administrators replace sample materials, assign courses and review knowledge versions before approving them.
- Group managers review their assigned employees through Mentingo's existing scoped reporting permissions.

## Feature Functions

- English and Thai navigation, with English fallback for missing translations.
- Replaceable lesson examples and media placeholders labeled in the selected language.
- Knowledge and demonstration SOP records with owners, versions, review status and source references.
- Honest AI setup-required state until permitted provider configuration and approved materials exist.
- Seven introductory review courses covering orientation, employee rights, safety, CCTV, networking, customer administration and SOP quality. Each includes four instructional lessons, three practice cases, a quiz and downloadable editable training materials.

## How It Works

HR supplies lesson materials through the existing course editor. Knowledge-library administrators create document, FAQ or SOP drafts, choose reader roles, upload private PDF/DOCX/TXT attachments, submit for review and approve non-sample versions. Revisions retain the lineage and reset approval; approving the latest version deactivates the previously approved version. Learners see authorized approved records or clearly labeled samples, while inactive records are hidden. SOP checkboxes are temporary reading aids. The same administrator can create and approve; independent reviewer enforcement is outside this MVP.

Learners complete assigned native lessons and assessments with stored progress. Group managers use their existing scoped reports. Course publication remains separate from knowledge approval, and the AI screen remains setup-required without simulated answers or automatic document ingestion.

The November 2026 curriculum is available in the local demonstration tenant as Sample Content. Its 112 presentation slides, eight Word/PDF workbooks, seven diagrams, 84 questions and 21 scenarios remain Draft pending company review. English lessons include provisional Thai summaries. HR can revise content through the existing authoring and resource tools. The five SOP templates do not establish official company procedures. The offline mentor context filter and practice prompts are preparation assets; live provider-backed retrieval and scoring remain unconnected.

## End-User Value

New hires have a consistent place to learn, supervisors can identify unfinished training, and HR can replace provisional content without changing application code.

## Key Technical Context

Source evidence: `courses`, `lesson`, `quiz`, `resource-library`, `ingestion`, `statistics` and `report` API modules; `Courses`, `Auth` and `Admin` web modules; shared permission/language constants. Existing `documents.metadata` can carry validated AITS knowledge metadata while retaining document IDs and tenant isolation. Existing group-manager report endpoints require `MANAGED_GROUP_RESULTS_READ`; no unrestricted HR role is needed. Existing ingestion processing states are not review approval states. RAG must exclude unapproved, inactive and unauthorized sources. Source inspection does not substitute for end-to-end acceptance tests.

## Test Evidence

A separate public review library can be built from the curriculum with `scripts/build-review-site.mjs` and served on GitHub Pages or Render Static Sites. It provides reading and downloadable files only, with visible Draft labels. It has no employee accounts, saved completion, manager reporting or live AI. The full application source remains available for separate backend deployment; `docs/PUBLISHING.md` records the free-tier constraints.

The local curriculum integration check exercised all seven courses through authenticated native APIs: lesson reads, 12-question quiz grading per course, stored completion, a new-login dashboard and denied learner edits. All 28 imported knowledge records remained Draft/sample. Six offline mentor-context tests cover approval filtering and missing-policy behavior. Browser smoke checks opened a course and lesson and found no horizontal overflow at the tested mobile width, but recorded React hydration errors. These checks do not prove a clean frontend regression or live AI readiness. Evidence and import receipts are in `training-content/quality-reports` and `training-content/imports`; no production deployment was performed.
