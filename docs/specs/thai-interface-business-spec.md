# Thai interface throughout AITS Learning Hub

## Business Overview

Thai-speaking employees can navigate the Learning Hub, learn, view results and manage training in Thai. The Thai catalog covers every interface key in the English catalog, including learner pages, reports, administration, settings and authentication. English remains selectable.

## Who Uses It

- Learners use Thai navigation, course controls, feedback and account settings.
- Managers read Thai report filters, progress labels and export controls within their existing permissions.
- Administrators manage courses, users, groups and configuration through Thai interface labels.

## Feature Functions

- Start new browser sessions and accounts without an explicit language preference in Thai.
- Preserve explicit account and saved browser language choices.
- Switch languages through account settings without changing permissions or assignments.
- Display Thai calendars and Thai-capable Prompt typography.
- Translate shared controls, upload status, table selection and dialog accessibility labels.
- Retain the seven bilingual visual lessons, with English and Thai displayed together.

## End-User Value

Employees can complete daily learning and administration tasks without depending on English navigation. Consistent labels and dates make the same workflows easier to understand across roles.

## How It Works

Users open the app in Thai by default unless they already selected another language. Existing users can choose Thai in Settings > Language. The selected language applies throughout the interface and is persisted by the existing account settings service.

This release translates application interface copy, not arbitrary database content, uploaded documents, third-party players, video audio or every previously authored English course lesson. Those materials retain their declared language. Course-language availability and company approval controls remain authoritative. Existing bilingual visual lessons are preserved.

## Key Technical Context

- The Thai catalog has full key parity with English (7,024 entries at implementation). Placeholders and markup are preserved.
- Existing Thai wording was retained; missing public interface copy received machine-assisted draft translation followed by targeted terminology review. Native Thai editorial review of the entire catalog remains advisable before broad rollout; coverage does not imply linguistic certification.
- No runtime translation API, paid subscription, credentials or employee data transmission is introduced. Translations are bundled with the application.
- `LanguageStore`, the existing language provider and account language settings preserve explicit preferences. New-account defaults use the shared Thai language constant.
- Shared controls subscribe to language changes; calendars use the existing locale resolver. No API contract or schema changes are required.

## Test Evidence

Automated checks cover key parity, nonempty Thai text, preserved interpolation/markup, reactive language switching, Thai defaults and explicit-preference preservation. The existing bilingual lesson tests remain part of validation. Live representative-page checks are recorded in the deployment status; full role-by-role business acceptance is separate from catalog coverage.
