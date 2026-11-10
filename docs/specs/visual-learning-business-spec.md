# Bilingual visual learning

## Business Overview

Employees can begin onboarding with small visual lessons and immediate practice feedback in the Knowledge & SOPs page. English and Thai appear together throughout the new experience. Seven introductory topics cover customer needs, document authority, safety awareness, CCTV, networks, service handovers and quality.

The design uses the user-supplied AITS palette (black, white, #C53130) and Prompt typography. Short interactive lessons, an interest-based starting point, gentle transitions and generous spacing translate the requested DataCamp, Duolingo, Apple and Muji references into AITS's own interface.

## Who Uses It

- Employees explore an introductory topic, read three visual slides and practise a decision.
- Technical learners change camera counts and power requirements in a PoE arithmetic exercise.
- Administrators retain the existing knowledge-record editing, version and approval controls below the visual experience.

## Feature Functions

- Choose a starting interest without changing job roles, permissions or assigned courses.
- Explore 21 bilingual slide screens with seven concept-flow diagrams.
- Watch two externally hosted Axis Communications videos on PoE and network audio, loaded on demand, with direct YouTube fallbacks.
- Read equivalent English and Thai learning explanations and answer choices; original video audio remains English, with publisher-dependent subtitles.
- Experiment with a PoE power budget and receive calculated feedback.
- Check seven practice decisions, retry and see browser-local progress.
- Expand reference articles when detailed source material is needed.

## End-User Value

Employees can start with an approachable topic, connect a visual explanation to an example and receive useful feedback immediately. Thai and English readers have access to the same new instructional content. The compact reference library remains useful for later lookup.

## How It Works

On first use, the employee chooses general onboarding, technical work or customer care. The choice opens a relevant lesson; all topics stay available. Slide controls move between three explanations. Technical topics include optional videos, and the CCTV topic includes a live arithmetic exercise. A correct practice answer marks that topic complete locally; another answer offers explanatory feedback and a retry.

These are educational drafts and fictional practice examples, not approved company policy or competency certification. English and Thai wording require company review. The original 28 reference articles and seven LMS courses are preserved; this release adds seven introductory micro-lessons, not a conversion of every existing course lesson.

## Key Technical Context

- Existing authenticated `/knowledge` route, existing route permissions and backend record approval rules remain in place. The new lesson content is static educational content bundled with the client; it must never contain confidential policies.
- `apps/web/app/modules/Aits/VisualLearning.tsx` orchestrates onboarding, slides, videos, feedback and progress. `visual-learning.data.ts` holds equivalent English/Thai content and the validated arithmetic function.
- Progress is stored in localStorage under the user's ID, scoped by browser origin. It is formative and editable by the browser owner; it does not update course completions, grades, certificates or manager reports. Storage failure is disclosed as session-only progress.
- No API changes, credentials, paid AI, new service subscriptions or video downloads. YouTube embeds use youtube-nocookie.com and only load after interaction; Google Fonts loads Prompt with local fallbacks. External availability and subtitles are outside AITS control.
- Keyboard-operable controls, visible focus states, responsive layout and reduced-motion CSS are included. Broader application accessibility and account onboarding redesign are outside this release.

## Test Evidence

Targeted component tests verify wrong/correct answers, no duplicate credit, browser persistence and separation between accounts, explicit video loading, slide navigation and PoE boundary validation. These do not establish full LMS progress integration or end-to-end manager reporting.

## Sources and editorial scope

Public AITS services: https://aitscctv.com/ . Technical reference: Cisco networking basics and Axis camera-power whitepaper, linked in the lesson. Safety awareness references ILO working-at-height guidance; no practical hazardous-work instructions or legal entitlements are added. Quality concepts reference ISO's public overview; examples are original instructional drafts.

Video discovery checked on 10 November 2026:

- Axis Communications, Academy 60 seconds — Power over Ethernet: https://www.youtube.com/watch?v=8YreJdKJqh0
- Axis Communications, Academy 60 seconds — Network audio: https://www.youtube.com/watch?v=5iB3AmPBXHA
- Additional Thai-language manufacturer resource (channel, not a curated lesson): https://www.youtube.com/channel/UC3-unZ3F-KTDlcefKlbbw0A

Design research: DataCamp's official exercise-type guidance and Duolingo's official learning-path explanation informed short practice and guided navigation. No third-party branding, assets or proprietary lesson content were copied.
