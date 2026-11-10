# Free pilot setup — 10 November 2026

The authenticated LMS is not deployed yet. GitHub Pages and the existing Render static site still serve the course review library. No paid services or custom domain are authorized.

## Resources prepared

- Supabase project: AITS Learning Hub (`nfbbmiqczekeedlsrtce`), AITSCCTV Free organization, Singapore. SQL connectivity verified. All 229 Core migrations and the Workflow/Graphile setup completed; 140 public application tables exist.
- Data API: disabled, confirmed in the connection dialog.
- Private storage bucket: `aits-learning-hub`, created with public access off and no anonymous policies. The dashboard shows the free-plan 50 MB object limit.
- Render Key Value: `aits-learning-hub-queue`, Singapore, Free ($0/month), 25 MB RAM, 50 connections, persistence off, noeviction selected during creation. Dashboard status is Available; application connectivity is not yet verified. External traffic remains blocked.
- Supabase S3 access key: the user chose to create and save it personally. The saved key passed a private S3 upload/download check on 10 November; the verification object was deleted.
- Restricted `lms_app_user` login provisioned and tested through the session pooler with TLS certificate verification. It has no superuser, database-creation, role-creation or RLS-bypass privileges. Credentials are stored only in the private local deployment file.

## Connection requirements

Use Supabase's session pooler on port 5432 for IPv4 connections. Transaction pooling is unsuitable for the migration session advisory lock and long-lived workflow sessions. No paid IPv4 add-on is needed for the session pooler.

The pooler login is `<database-role>.<project-reference>`; SQL grants must target the actual database role without the routing suffix. The deployment preparation branch adds this parsing and lets the API bind Render's PORT, defaulting to 3000 locally.

Keep migration-owner credentials separate from the restricted application role. Obtain credentials through a local file outside this repository or the hosting environment, never a public commit or frontend variable. The private credential file is outside OneDrive and Git. Do not use the existing destructive upstream seeds or relax the local-only AITS seed guard.

## Outstanding before deployment

1. Database connectivity, restricted role provisioning and migrations are complete. Tenant/admin initialization and curriculum import remain pending the final app origin.
2. Private S3 upload/download is verified. Signed downloads through the app remain to be tested.
3. QueueService now shares producer/worker connections and creates QueueEvents on demand. An isolated Redis test with maxclients=50 passed with all 24 queue workers, retry/completion delivery, fewer than 35 total connections, and clean connection release. Full-app connection and memory measurements still remain.
4. Validate restart behavior with nonpersistent Redis, especially session revocation and queued work. Durable course/progress data belongs in PostgreSQL.
5. Build and measure the API within Render's 512 MB free instance; local memory previously measured about 519 MB, which is a risk rather than a Linux deployment result.
6. The user selected GitHub Pages as an entry page linking to the full app on Render. `render.Dockerfile` packages both apps, and optional `WEB_DIST_DIR` hosting serves the frontend on the API origin while preserving API/WebSocket routes. Live login and role checks still need verification after deployment.
7. Initialize the HTTPS tenant and a unique administrator without default public credentials, import the curriculum, and verify learner/manager/admin boundaries.
8. Verify live login, lesson access, grading, persistent progress, reports, uploads, restart and cold-start behavior. Keep paid AI providers unconfigured.

The workspace already has other Render web services. Free instance hours are shared; check remaining quota before launch without suspending unrelated services.

## Validation at this checkpoint

- On 10 November, the production frontend build completed, including the SPA HTML shell. Three same-origin hosting tests passed (page/assets, API/WebSocket exclusion, missing build detection), and scoped lint passed. The combined image itself has not yet been built or deployed on Render.

- Shared package builds and the full API build passed, including Workflow typecheck and compilation (22 steps, 1 workflow).
- Scoped ESLint passed for the changed API files.
- Five tests passed across the database-role parser and isolated Redis integration suites. The test container was stopped and removed after validation.
- Both migrator and restricted runtime connections succeeded with the provider CA and `sslmode=verify-full`.
- No tenant, administrator or employee accounts have been initialized. No authenticated Render web service has been deployed. Source changes remain on the local `codex/free-hosting-preparation` branch until the deployment configuration is complete.
