# Free pilot status — 10 November 2026

The full Learning Hub is live at https://aits-learning-hub.onrender.com. GitHub Pages at https://aitscctv.github.io/aits-learning-hub/ provides the Thai-first welcome and sign-in entry. The original review library remains at `review.html`. No custom domain or paid service is configured.

## Hosted resources

- Render Web Service `aits-learning-hub` (`srv-dbp6r98n74is73d1u980`): Docker, Singapore, Free. Current source commit `632d6a7` deployed from `codex/free-hosting-preparation`, using `render.Dockerfile`. Deployment `dep-dbpabe29lscs73b16pqg` succeeded on 10 November 2026 at 12:16 Bangkok time; background workers started at 12:16:13. It includes employee onboarding and Thai wording/calendar corrections, verified live. The initial onboarding release `36bf172` succeeded at 12:00.
- Render Key Value `aits-learning-hub-queue`: Singapore, Free, 25 MB, 50 connections, noeviction, no persistence. External access is blocked.
- Supabase project `nfbbmiqczekeedlsrtce`: Free organization, Singapore; PostgreSQL and private `aits-learning-hub` storage bucket. Data API is disabled. Session pool size is 30 to accommodate overlapping Render startup (the default 15 caused `EMAXCONNSESSION`). No plan upgrade was made.
- All 229 core migrations plus Workflow/Graphile setup completed. The application uses a restricted runtime database role and a separate migration owner through the IPv4 session pooler, with certificate verification enabled.
- Credentials remain in private local files and Render environment variables. None are in GitHub or frontend variables.

## Initialized content

A tenant for the real HTTPS origin and one administrator were created without running the destructive upstream seed or local demo seed. The administrator completed the required first-login password change.

Imported material remains pending company approval: 7 draft courses, 28 reading lessons, 7 practice quizzes with 84 questions, and 28 draft knowledge records. The quizzes use the source material’s proposed 80% practice threshold; it is not an approved competency policy. No employees were assigned, certificates issued, or content approvals fabricated. Manuals, presentations and other review assets remain downloadable from the public library.

The Knowledge page now adds seven English/Thai micro-lessons, 21 branded slide screens, seven concept diagrams, seven practice questions, an interactive PoE calculation exercise and two on-demand Axis YouTube videos. Video audio is originally English; companion learning text is bilingual. Interest-based onboarding and browser-local practice progress are separate from LMS course grades and manager reports. The existing reference records remain available in an expandable library. See `docs/specs/visual-learning-business-spec.md` for sources and scope.

## Verified

- Live health check: HTTP 200.
- Administrator login: HTTP 201; authenticated current-user request: HTTP 200; first-login password change required.
- Authentication cookies retain HttpOnly, Secure and SameSite=Strict attributes. Frontend and API share the Render origin.
- Private S3 upload/download passed; the temporary verification object was removed.
- Restricted-role tenant isolation: zero courses without tenant context; seven courses with the AITS tenant context.
- Combined Docker build passed. Its frontend build needs a larger build-only Node heap; the running service uses a separate 384 MB heap setting.
- Local production container under a hard 512 MB memory limit started successfully, returned health/login pages with HTTP 200, and used approximately 422 MiB at idle. This is not a load-test capacity guarantee.
- Full app used 33 Redis connections against a 50-connection test limit.
- Eight targeted tests passed for frontend routing, Supabase role parsing, and queue connection/retry behavior. Scoped type checking, lint and formatting passed.
- Visual learning: three component tests, scoped type checking/lint, full frontend build and desktop/mobile preview checks passed. Three Redis integration tests passed with a 50-client limit, covering old/new workers, completion events, retries and shutdown without open handles. Full API build passed.
- The live rollout logged HTTP startup, successful deployment and subsequent background-worker release. The Redis gate delays duplicated worker sockets during overlap; no background features were disabled.

## Thai interface

The Thai interface has full English-catalog key parity (7,024 entries), including authentication, learner navigation, course controls, knowledge navigation, reports, administration and settings. New users without an explicit language choice start in Thai; existing saved choices remain intact. Thai calendars, Prompt typography, shared control labels and Video.js controls are included. English remains selectable.

Three Thai coverage/behavior tests and three visual-learning regression tests passed. API/web scoped type checking, lint and formatting passed, as did the full production frontend build. The offline cache asset limit increased from 3 MiB to 4 MiB to accommodate the bundled catalog. No paid service or runtime translation API was introduced.

Live verification confirmed Thai settings, course controls and report filters/metrics with the administrator account. Render reported a successful deployment and background-worker startup. Screenshots are saved in the local `outputs/thai-interface` folder.

The catalog uses machine-assisted translation with targeted terminology review; a native Thai editorial pass is still advisable. Interface coverage does not translate uploaded documents, existing English course bodies or external video audio. The seven bilingual visual lessons remain available.

## Employee onboarding and role learning

The public welcome invites employees to sign in. The authenticated `/learn` journey introduces company services and working habits, shows HR/CEO and Ethan/Kaung/Kai support contacts, and keeps accounting as the requested placeholder. Eight work-function choices follow the supplied organization-chart functions. Phone numbers, email addresses and reporting lines are not invented.

The path contains nine bilingual practice courses and 32 lessons. Thai lesson bodies, examples, answer choices and feedback are included; English remains selectable. Shared welcome/SOP essentials appear for everyone, alongside only relevant specialist courses. The account stores onboarding stage, selected learning role and completed lessons. Choosing a role does not assign system permissions. This practice progress is separate from native LMS grades and certificates; original draft LMS records are preserved.

The test learner `test@aitscctv.com` has only the student system role and Thai preferences. Its random password is stored outside the repository in the private local deployment folder. No email was sent. Login and role readback passed. After browser testing, the account was reset to the company introduction, no selected learning role and zero completed lessons.

Live browser verification confirmed automatic learner routing into `/learn`, company/people/role steps, the named contacts, engineering and accounting course filtering, incorrect-answer gating, next-lesson unlock, progress after reload, and switching between Thai and English. Five learning-flow tests passed again after the Thai terminology/calendar corrections. Screenshots are saved locally in `outputs/employee-onboarding` (welcome, contacts, role selection, engineering path and Thai lesson).

Validation: eight frontend tests cover role filtering, full bilingual lesson fields, sequential unlocks, correct-answer progress, remount persistence, failed saves and Thai interface parity. Two API schema tests cover accepted state and rejection of unsupported roles, extra properties, duplicates and excessive progress. API and frontend production builds, scoped lint, formatting and type checking passed. Source contracts were regenerated through normal app startup and the existing client generator.

## Pilot limits and remaining work

- Email delivery is unavailable. `EMAIL_ADAPTER=mailhog` points only to `127.0.0.1:1025`, where no mail server is running. Invitations and password-reset emails cannot be relied upon. This avoids requiring paid email during initial startup, but it is not an email delivery service.
- No live AI provider, payment provider, video service or external meeting service is configured.
- Free Render services sleep; startup can take several minutes for this application. Free hours are shared with the workspace’s other services.
- Free Redis loses queued state and revocation markers on restart. Durable progress is stored in PostgreSQL, but restart/session behavior needs further review before broader employee rollout.
- Company review, employee provisioning, native LMS course assignment, manager journeys, grading, reports and app-mediated file uploads still need acceptance testing. Draft content is intentionally not an approved training program. The knowledge-page visual lessons store practice progress in the browser; the new `/learn` employee path stores progress in the account. Neither feeds native LMS grades or manager reports. Broader rollout should include workload and database-pool sizing checks.
- Heavy document/media conversion and concurrent usage have not been validated within 512 MB. Supabase free quotas and inactivity behavior also apply.

The existing local development checkout is preserved. The public review site remains available independently of the authenticated application.
