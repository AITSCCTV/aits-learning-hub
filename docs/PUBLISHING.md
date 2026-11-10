# AITS GitHub and free hosting

This repository is a source snapshot of the AITS implementation based on Selleo/Mentingo commit `a0df13891eb49846c4c2fc9a379909079232c9f2`. The upstream MIT license is retained. The original development checkout and its Git history were preserved separately.

Local credentials, databases, runtime tools, import receipts, rendered QA intermediates and upstream deployment workflows are excluded. The source includes the full application and the seven-course Draft review curriculum. Sample passwords in upstream test/seed fixtures are not production credentials. Never deploy the destructive upstream seed or its default accounts to a public service.

## Free course review site

Run `node scripts/build-review-site.mjs` from the repository root. It produces `site/` with the seven course libraries, 28 readable lessons and editable/downloadable assets. No dependency installation is needed for this build.

`render.yaml` defines only a free Render Static Site. It does not provision paid services or deploy an authenticated LMS. The same `site/` output can be published on GitHub Pages from a `gh-pages` branch. Relative URLs support `/aits-learning-hub/` hosting. The visible site states the Draft review status and backend limitations.

## Full LMS free pilot

The combined frontend/API is live at https://aits-learning-hub.onrender.com using `render.Dockerfile`, Render Free web and Key Value services, and Supabase Free PostgreSQL/private storage. GitHub Pages links to the app so authentication stays on a single origin with secure, strict SameSite cookies. No custom domain is configured.

See `deployment/RENDER-FREE.md` for settings and `docs/FREE-PILOT-STATUS.md` for verified behavior and limits. The live deployment uses commit `cdfd774` on `codex/free-hosting-preparation`; subsequent main-branch documentation and public-library updates do not change that running app.

The actual HTTPS tenant, unique administrator, seven draft courses, 28 reading lessons, seven practice quizzes and 28 draft knowledge records are initialized. The administrator must change the temporary password at first login. Do not rerun upstream destructive seeds or weaken the local-only demo seed guard.

This is a free pilot: startup can be slow, Redis is nonpersistent, and email/live AI are not enabled. The local container passed startup at 512 MB with about 422 MiB idle usage; concurrent usage and heavy conversion remain untested. Broader employee rollout requires content approval and acceptance testing.

References: [Render Free](https://render.com/docs/free), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
