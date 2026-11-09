# AI configuration and safeguards

## Current local state

No AI provider key has been configured. No live AI response has been tested. The ignored API environment disables scheduled semantic indexing and public product-help retrieval. Do not interpret missing credentials as permission to simulate provider responses.

The AITS Mentor page is an explicit setup-required screen. Adding an API key alone does not enable its chat or connect the knowledge library to retrieval. No knowledge attachments are extracted, embedded or sent externally. The controls below must be implemented and verified before enabling company-policy answers.

## Existing integration

Backend configuration includes `OPENAI_API_KEY`, `MASTER_KEY`, Langfuse settings and optional connected services. Inspect the existing encrypted environment/settings services before adding new key storage. Never put secrets in `VITE_` variables or generated frontend code.

The existing ingestion/chunk/embedding services and pgvector storage should be evaluated before introducing a separate RAG stack. Existing `AI_USE` permissions and tenant boundaries must apply to each request, including retrieval and returned citations.

## Required before enabling company-policy answers

- Explicit permission/configuration for sending confidential documents to the chosen external provider.
- Approved and active knowledge versions, with role-aware retrieval and traceable source references.
- Tests that draft/sample, deactivated, other-tenant and unauthorized sources cannot be used.
- Honest no-source response and escalation to HR/supervisor instead of invented rules.
- Configurable provider/model and an observable setup-required/disabled state.
- Token usage records, configured price estimates and monthly spending controls. Estimated costs must be labeled as estimates, not provider invoices.
- Atomic reservations/settlement for concurrent requests so a monthly limit cannot be bypassed by parallel calls.

These safeguards are requirements, not claims that they are already implemented by upstream Mentingo. Keep company-policy AI disabled until verified.
