# Free pilot status — 10 November 2026

The full Learning Hub is live at https://aits-learning-hub.onrender.com. GitHub Pages at https://aitscctv.github.io/aits-learning-hub/ provides the public review library and a sign-in link. No custom domain or paid service is configured.

## Hosted resources

- Render Web Service `aits-learning-hub` (`srv-dbp6r98n74is73d1u980`): Docker, Singapore, Free. The deployed source is commit `cdfd774` on `codex/free-hosting-preparation`, using `render.Dockerfile`.
- Render Key Value `aits-learning-hub-queue`: Singapore, Free, 25 MB, 50 connections, noeviction, no persistence. External access is blocked.
- Supabase project `nfbbmiqczekeedlsrtce`: Free organization, Singapore; PostgreSQL and private `aits-learning-hub` storage bucket. Data API is disabled.
- All 229 core migrations plus Workflow/Graphile setup completed. The application uses a restricted runtime database role and a separate migration owner through the IPv4 session pooler, with certificate verification enabled.
- Credentials remain in private local files and Render environment variables. None are in GitHub or frontend variables.

## Initialized content

A tenant for the real HTTPS origin and one administrator were created without running the destructive upstream seed or local demo seed. The administrator must change its unique temporary password at first login.

Imported material remains pending company approval: 7 draft courses, 28 reading lessons, 7 practice quizzes with 84 questions, and 28 draft knowledge records. The quizzes use the source material’s proposed 80% practice threshold; it is not an approved competency policy. No employees were assigned, certificates issued, or content approvals fabricated. Manuals, presentations and other review assets remain downloadable from the public library.

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

## Pilot limits and remaining work

- Email delivery is unavailable. `EMAIL_ADAPTER=mailhog` points only to `127.0.0.1:1025`, where no mail server is running. Invitations and password-reset emails cannot be relied upon. This avoids requiring paid email during initial startup, but it is not an email delivery service.
- No live AI provider, payment provider, video service or external meeting service is configured.
- Free Render services sleep; startup can take several minutes for this application. Free hours are shared with the workspace’s other services.
- Free Redis loses queued state and revocation markers on restart. Durable progress is stored in PostgreSQL, but restart/session behavior needs further review before broader employee rollout.
- The initial administrator must set a personal password. Company review, employee provisioning, course assignment, learner/manager journeys, grading, reports and app-mediated file uploads still need acceptance testing. Draft content is intentionally not an approved training program.
- Heavy document/media conversion and concurrent usage have not been validated within 512 MB. Supabase free quotas and inactivity behavior also apply.

The existing local development checkout is preserved. The public review site remains available independently of the authenticated application.
