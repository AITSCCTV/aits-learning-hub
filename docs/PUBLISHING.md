# AITS GitHub and free hosting

This repository is a source snapshot of the AITS implementation based on Selleo/Mentingo commit `a0df13891eb49846c4c2fc9a379909079232c9f2`. The upstream MIT license is retained. The original development checkout and its Git history were preserved separately.

Local credentials, databases, runtime tools, import receipts, rendered QA intermediates and upstream deployment workflows are excluded. The source includes the full application and the seven-course Draft review curriculum. Sample passwords in upstream test/seed fixtures are not production credentials. Never deploy the destructive upstream seed or its default accounts to a public service.

## Free course review site

Run `node scripts/build-review-site.mjs` from the repository root. It produces `site/` with the seven course libraries, 28 readable lessons and editable/downloadable assets. No dependency installation is needed for this build.

`render.yaml` defines only a free Render Static Site. It does not provision paid services or deploy an authenticated LMS. The same `site/` output can be published on GitHub Pages from a `gh-pages` branch. Relative URLs support `/aits-learning-hub/` hosting. The visible site states the Draft review status and backend limitations.

## Full LMS deployment remains separate

The selected free-pilot layout now uses GitHub Pages as the entry page and the combined `render.Dockerfile` for the frontend and API on one Render origin. See `deployment/RENDER-FREE.md` for configuration and `docs/FREE-PILOT-STATUS.md` for verified progress. The combined image is prepared locally; it is not yet a live authenticated service.

The app needs the API, frontend, PostgreSQL with pgvector, a Redis-compatible queue service and private S3-compatible object storage. Production initialization must create the tenant for its actual HTTPS origin and an administrator with a unique credential, using a reviewed non-destructive bootstrap. The current AITS demonstration seed intentionally accepts only a local database and must retain that safeguard.

The deployment preparation branch reads PORT (default 3000) and listens on all interfaces. The existing web Docker image serves static frontend files on port 8080; it does not proxy `/api` or WebSockets. Authentication uses strict SameSite cookies, so deploy behind one origin or design and verify appropriate same-site routing. Separate arbitrary onrender.com origins are not a tested login configuration. Use separate migration-owner and restricted runtime database roles.

A local observation on 9 November 2026 found about 519 MB working memory for the running API. Render Free provides 512 MB, so successful backend operation on that tier is unverified and may exceed its memory allowance. Free PostgreSQL expires after 30 days, free Key Value loses state on restart, and free web services do not provide persistent disks. There is no configured external private file store for this deployment. No paid resources are authorized.

Before claiming a working hosted LMS: test a compatible free backend configuration; supply private storage; perform reviewed initialization and content import; verify real authentication, resource downloads, grading, persistence and role boundaries. Live AI additionally requires a configured provider and approved-source retrieval. The local completion results do not establish hosted readiness.

References checked 9 November 2026: [Render Free](https://render.com/docs/free), [compute limits](https://render.com/docs/compute-plans), [Postgres extensions](https://render.com/docs/postgresql-extensions), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
