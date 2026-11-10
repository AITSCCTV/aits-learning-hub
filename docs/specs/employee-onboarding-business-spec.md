# Thai-first employee welcome and learning paths

## Business Overview

New starters meet AITS, find support contacts and choose a work function before seeing relevant learning. Thai is first; English is selectable. Small lesson screens, a clear path and short practice questions help employees get started without browsing unrelated departments.

## Who Uses It

- New employees sign in, learn the company introduction and find people who can help.
- HR and managers use a test account to review the journey before broader rollout.
- Existing administrators retain the full LMS administration interface.

## Feature Functions

- Welcome visitors with a simple sign-in invitation.
- Introduce company services and practical working habits before role selection.
- Show HR/CEO and technical support contacts, and the requested accounting placeholder.
- Offer eight learning roles based on the supplied organization-chart functions.
- Show shared essentials and role-specific courses, with Thai lesson bodies, examples and questions.
- Save onboarding stage, selected learning role and completed lessons to the signed-in account.
- Require a correct practice answer before completing a lesson; keep completed lessons available for review.
- Allow users to change their learning role without changing security permissions.

## End-User Value

Employees can find a useful first lesson and a support contact quickly. Their learning path survives browser reloads and subsequent sign-ins, and stays focused on their work.

## How It Works

The public root welcomes a visitor and sends them to the existing sign-in flow. Learners arriving through the dashboard or course list continue into the employee learning path. First-time learners review the company introduction and support directory, then select their function. The path shows shared company/SOP essentials plus relevant specialist material. Each lesson presents short reading screens, key points, an example and a question. A correct answer allows progress to be saved and the next lesson to open.

The supplied organization chart establishes management and operations functions. The user additionally named HR and CEO for people matters and Ethan, Kaung and Kai for technical support. Accounting remains a placeholder as requested. No phone number or email address is invented; employees ask their manager for the approved channel. The original chart image and employee photographs are not published.

The pilot has nine courses and 32 lessons. Existing source-based curriculum is adapted into Thai and English; HR/purchasing and accounting additions teach generic document-handling and escalation practices. These are practice lessons pending owner review, not approved employment policies, transaction authority or competence certifications. Progress in this new learning path is not substituted for native LMS grades or certificates. Original draft LMS records remain intact.

## Key Technical Context

- Public welcome at `/`; authenticated learning at `/learn`. Existing authentication, password-change and MFA requirements remain authoritative.
- The existing tenant-scoped self-settings API persists a validated optional `employeeLearning` object. There is no schema migration or paid service.
- Role selection is a learning preference, never a system role assignment. Only learner dashboard/course-list entry is redirected; administrative permission checks are preserved.
- Role filtering and sequential lessons personalise the UI, not confidential-content access control. Bundled generic lessons contain no confidential company documents.
- Translations are bundled, with no runtime translator. The translated legacy lesson bodies need native Thai editorial and content-owner review before formal adoption.

## Test Evidence

Validation covers role-course mappings, bilingual lesson completeness, sequential unlocks, saved progress and schema rejection of invalid learning state. Browser verification and release details are recorded in the deployment status after deployment.
