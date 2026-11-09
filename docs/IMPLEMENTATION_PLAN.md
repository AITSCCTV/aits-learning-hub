# Implementation status and remaining work

## Implemented

- Mentingo baseline installed, migrated and run before product changes; original course, assessment, permission and tenant infrastructure retained.
- Separate guarded AITS development seed: five synthetic accounts, sixteen bilingual sample courses, 48 assignments, scoped manager membership and four sample knowledge entries.
- AITS textual branding, Thai language selection, core learner translations, sample/media placeholders and English fallback.
- Versioned knowledge library with ownership, source references, role visibility, review/approval/deactivation, private PDF/DOCX/TXT attachments and demonstration SOP checklists.
- Honest setup-required AI screen. No knowledge records are embedded or submitted to an AI provider.
- Native persisted learner completion and two-question quiz scoring verified through authenticated HTTPS requests. Manager reporting excludes the employee outside the assigned team.

## Remaining acceptance work

- Knowledge lifecycle and TXT/PDF/DOCX upload/download integration checks passed; equivalent browser flows remain to be accepted.
- Production API/web builds and focused lint passed. Windows file-loader regression tests and incremental compilation also passed.
- Native administrator course creation, editing, assignment and learner write denial passed through authenticated APIs. Native lesson material replacement and learner edit denial also passed; verify the equivalent browser flows.
- Verify desktop/mobile layouts, navigation, Thai wrapping and complete browser workflows. Computer-use reports that local browser use is disabled in Work settings; no visual acceptance is claimed.
- Review all Thai wording with a native speaker; optional administration/email/report surfaces still use English fallback.
- Obtain official materials and approved identity assets from Matsumoto. Samples must remain labeled until then.

## Deferred until AI configuration and approved content exist

Approved-only retrieval, citations, policy-answer checks, cost estimation and transactional monthly spending caps are not enabled. Configuring a provider key alone does not make the AITS mentor ready; implement and test these controls before enabling it. See AI_CONFIGURATION.md.

