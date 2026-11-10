# Render free pilot

The approved layout is a GitHub Pages entry page linking to the authenticated Learning Hub on one Render origin. No custom domain is used.

Create a **Web Service**, runtime **Docker**, in **Singapore**, using `render.Dockerfile`. Select **Free ($0)** explicitly; do not accept the default paid instance. Keep the existing static course library until the authenticated app passes verification. The root `render.yaml` still describes that static library, not this web service.

The combined image includes the frontend under `/app/public`. Its same-origin API calls preserve the existing HttpOnly, Secure, SameSite=Strict authentication cookies. API routes, WebSockets and OAuth discovery routes bypass the frontend fallback. Missing asset files remain 404 responses.

Set these variables only on the backend service:

| Variable                                               | Source                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `MIGRATOR_DATABASE_URL`                                | Supabase session pooler, owner login, URL-encoded password, `sslmode=verify-full`    |
| `LMS_DATABASE_URL`                                     | Session pooler, restricted `lms_app_user.<project-ref>` login, `sslmode=verify-full` |
| `REDIS_URL`                                            | Internal URL of the free Singapore Key Value instance                                |
| `S3_ENDPOINT`                                          | Supabase Storage S3 endpoint                                                         |
| `S3_REGION`                                            | `ap-southeast-1`                                                                     |
| `S3_BUCKET_NAME`                                       | `aits-learning-hub`                                                                  |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`             | User-created S3 key; backend only                                                    |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ANALYTICS_SECRET` | Separate cryptographically random secrets                                            |
| `JWT_EXPIRATION_TIME`                                  | `24h`, matching existing token/cookie expiry                                         |
| `MASTER_KEY`                                           | Stable, cryptographically random 32-byte key encoded as Base64                       |
| `SEMANTIC_SEARCH_BACKGROUND_INDEXING_ENABLED`          | `false` until a provider and budget are approved                                     |
| `WORKER_CONCURRENCY`                                   | `1` for initial memory measurements                                                  |

The image sets `NODE_ENV=production`, `WEB_DIST_DIR=/app/public`, and `NODE_EXTRA_CA_CERTS=/app/certs/supabase-ca.crt`. Render supplies `PORT`. Do not set any private credentials in `VITE_` variables. Leave external AI/payment/email integrations unconfigured until their behavior is reviewed. SMTP on the usual ports is unavailable on Render Free; email-dependent onboarding must be verified separately.

Before exposing login, initialize the real HTTPS tenant and a unique administrator through a non-destructive bootstrap. Never run the local demo seed or upstream seed with default accounts on this database.

The initial free deployment is live; tenant/admin initialization, draft curriculum import, and live administrator authentication are verified. Learner/manager acceptance tests, load testing and app-mediated upload checks remain. Free Redis is nonpersistent; restart behavior and session revocation require validation. Render's shared free-hour allowance also covers the workspace's other web services.

For this email-free pilot, set `EMAIL_ADAPTER=mailhog`, `SMTP_HOST=127.0.0.1`, `SMTP_PORT=1025`, empty `SMTP_USER`/`SMTP_PASSWORD`, and `SMTP_EMAIL_FROM=noreply@aitscctv.com`. No local mail server is running: email delivery will fail, and invitations/password resets must not be advertised as working. Set `HELPDESK_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=384`, and health check `/api/healthcheck`.
