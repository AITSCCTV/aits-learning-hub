# Known limitations

The AITS MVP is not yet accepted or production-ready. See IMPLEMENTATION_PLAN.md for remaining work.

- Authenticated API login, current-user, persisted learner completion, quiz scoring and scoped manager reports passed. Local browser use is disabled in Work settings; desktop/mobile visual acceptance remains pending.
- AITS seed created five synthetic accounts, sixteen language-specific courses and 48 assignments. Branding, Thai support, placeholders and the knowledge API are implemented; see SETUP_LOG.md for verified integration checks.
- Native course editing supports Thai. The pinned external Luma authoring SDK does not, so its API schemas reject Thai rather than silently generating another language.
- Core learner labels have Thai translations. Optional email/report features retain explicit English fallbacks; full Thai editorial review is outstanding.
- The AITS mentor is setup-required. Approved-document retrieval, token accounting and enforceable spending caps are not enabled or claimed. No documents are sent to AI providers by the knowledge extension.
- Knowledge files are stored privately for authorized downloads, without automatic text extraction or embedding.
- Knowledge approval currently permits the creating administrator to approve a non-sample version. A two-person approval rule is not implemented. SOP checkboxes are local reading aids, not persisted completion or compliance evidence.
- Existing source-level capabilities must still pass learner/admin/manager workflow testing.
- Public marketing information cannot establish internal policy or asset reuse rights. No unverified company logo has been copied into the app.
- The workspace is inside OneDrive; installing thousands of dependency files is slow.
- System-default Node is 18.20.8, below the required 22.15.0. Node 24 fails the pinned Sentry native profiler. Use the portable Node 22.15.0 selected by the Windows wrapper.
- The ambient pnpm 11.25.0 ignores the repository's legacy override settings and fails frozen installation. Use Corepack with the pinned pnpm 10.22.0; do not rewrite the lockfile to bypass this.
- Upstream development Compose has fixed container names, host ports and development credentials. It is not a production deployment configuration.
- Upstream setup copies environment files and runs demo seeds. Inspect it before rerunning against a database with existing records.
