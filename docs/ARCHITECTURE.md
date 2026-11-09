# AITS Learning Hub architecture

Discovery baseline: upstream Selleo/mentingo commit `a0df13891eb49846c4c2fc9a379909079232c9f2`, cloned 2026-11-06. MIT license retained. This is the actual Mentingo monorepo, not a replacement application.

## Existing system

- `apps/web`: React 18, Remix, Vite, Tailwind, Radix UI; explicit `routes.ts`, TanStack Query and generated Axios client.
- `apps/api`: NestJS 10, TypeBox request/response validation, Swagger; domain controllers/services/repositories.
- `packages/shared`: permissions, languages, lesson types and shared contracts.
- PostgreSQL 16 with pgvector and Drizzle migrations. Tenant-scoped runtime access uses a restricted database role and RLS; migration/seed connections are separate.
- JWT cookie authentication, refresh tokens and Redis-backed session revocation. Existing permission guards remain authoritative.
- BullMQ, outbox events and Socket.IO support background work and notifications.
- The checked-out Compose file uses RustFS S3-compatible storage, Redis and Mailhog. Some upstream docs still say MinIO.
- Existing AI modules include mentor conversations, document ingestion/chunking/embeddings, and Langfuse tracing. Their presence does not establish AITS approval-only retrieval or budget enforcement.

## Extension boundaries

Reuse the course authoring, assignment, assessment, progress, resource library, FAQ and group-manager flows. AITS knowledge approval/version records must reference existing stored resources and be tenant-scoped. Only an approved, active version with actor-authorized visibility may enter authoritative retrieval. Publication alone must not imply company approval.

Use the existing generated API workflow for new contracts and Drizzle generation for migrations. Keep SOP demonstration checklists separate from compliance decisions. Future technician and administration modules should reference approved knowledge versions rather than duplicate policy text.

## Implemented AITS extension

`apps/api/src/aits` provides validated knowledge endpoints backed by existing tenant-scoped `documents.metadata`. The `aits-knowledge-v1` namespace separates these records from other document uses. No database schema changes are required. The repository uses per-lineage transaction locks and compare-and-swap updates to protect revisions and approval transitions. Private attachments use existing S3 storage and file validators; signed download links expire after 60 seconds and are issued only after checking current record visibility.

`apps/web/app/modules/Aits` adds knowledge editing, review actions, temporary SOP checkboxes, replaceable lesson-media placeholders and the setup-required mentor page. Query and mutation hooks use the generated client and existing permission system. Native Mentingo course publication and knowledge approval remain independent. The extension does not create embeddings or connect its records to AI retrieval.

The guarded `aits-seed.ts` creates a separate local tenant and preserves existing tenant data. It uses native courses, lessons, assessments, enrollments and group-manager assignments. API build packaging explicitly copies complete migration directories, including their JSON journals, before workflow compilation.

## Trust boundaries

No real employee records or private policies have been supplied. Public company marketing is not an HR-policy source. Demo data must be visibly labeled in English and Thai. AI credentials belong in backend configuration only; no confidential documents may be sent to a provider until explicitly approved and configured. Local setup leaves the AI key blank and disables scheduled semantic indexing.
