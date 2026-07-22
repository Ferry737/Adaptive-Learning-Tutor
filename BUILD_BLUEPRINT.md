<!-- /autoplan restore point: C:\Users\Mr.X\.gstack\projects\Adaptive-Learning-Tutor\unknown-autoplan-restore-20260720-014739.md -->

# Adaptive Learning Tutor: 0-to-100 Build Blueprint

Status: AUTOPLAN REVIEWED / CONDITIONAL PASS — M0→M4 INTERNAL ALPHA  
Source specification: `Premium_Prompt.md`  
Repository baseline: greenfield; the initial audit found only `Premium_Prompt.md` and no Git history. This is the canonical blueprint; any other blueprint draft is non-canonical.  
Audience: a coding agent who must implement, test, document, and report each vertical slice.

## 1. Mission and product contract

Build an installable, responsive AI-native tutor for PC browsers, Windows/macOS desktop use, iPhone Safari, and PWA installation. The first release prepares learners for:

- Multicheck Attest (EBA).
- Multicheck Wirtschaft und Administration.
- Kaufmann/Kauffrau EBA and EFZ pathways.

The product promise is not “chat with an AI.” It is measurable independent learning:

```text
attempt -> evaluate -> explain -> correct -> retry -> record evidence -> review later
```

The application must start at the learner's demonstrated level, preserve evidence of what happened, and never claim that an unofficial simulation is an official Multicheck item.

### 1.1 Product wedge and validation gate

The first externally testable promise is deliberately narrower than the twelve-month roadmap: a Swiss apprenticeship candidate can diagnose and improve one German-and-mathematics foundation track through the attempt -> feedback -> retry -> delayed-review loop. M4/M5 is an internal-alpha slice, not a promise that every EBA, WA, EFZ, connector, or exam feature is already complete.

Before any paid or public beta, validate this with a private cohort of 5–10 learners and 20–40 human-reviewed activities:

- at least 70% diagnostic completion;
- at least 50% of learners return for a second session within seven days;
- delayed unaided retrieval beats the learner's own baseline on a pre-registered fixture;
- at least 80% of learners can explain the uncertainty label and content provenance;
- no unresolved privacy, age/consent, provenance, or answer-revelation incident.

Continue only if the thresholds are met and the content owner signs the review. Otherwise stop external expansion, repair the learning loop or content, and re-run the same fixture. Acquisition, pricing, and whether Persian is a primary wedge remain founder decisions before a public launch.

### 1.2 External-release safety gate

The target audience may include minors. Before external account creation or cloud-provider use, M0 must document the age floor, guardian/consent flow, Swiss FADP/GDPR basis as applicable, support contact, retention/deletion schedule, data-residency and provider-transfer policy, abuse/rate limits, and trademark review. This is a product/legal gate, not legal advice. Internal mock-provider development may proceed with synthetic data only.

### Legal and provenance boundary

Display this exact disclaimer in onboarding, settings, and the exam-mode preamble:

> This is an independent learning and preparation application. It is not affiliated with, endorsed by or operated by gateway.one. Practice questions are original simulations and are not official Multicheck® test questions.

Never promise a score, apprenticeship placement, or exam result. Do not use Multicheck® in the product name or in a way that implies affiliation or endorsement.

Use official public descriptions only as curriculum references. Store source URL, access date, source locator, claim status, and release reviewer. Mark every generated item as unofficial. Never copy, reconstruct, or distribute proprietary questions. Direct learners to the official demo for interface familiarity. The agent must re-verify official categories and timings before publishing or changing curriculum data:

- [gateway.one Multicheck interpretation](https://www.gateway.one/de-CH/multicheck-interpretieren.html)
- [gateway.one Multicheck demo](https://www.gateway.one/it-CH/multicheck-demo.html)
- [Lehrplan 21 Zurich](https://zh.lehrplan.ch/)
- [Lehrplan 21 Mathematics](https://zh.lehrplan.ch/index.php?code=b%7C5%7C0)

## 2. Decisions already approved

| Decision | Approved direction | Why |
|---|---|---|
| Build approach | Staged production-shaped modular monolith | Delivers a real tutor early while retaining a clean path to the connector and relay. |
| Review posture | Hold scope | The prompt already defines a large product; the work is sequencing and making every edge case explicit. |
| Repository boundary | `pnpm` workspace from day one; only the web app runs initially | Domain boundaries exist before connector work, without building dead infrastructure. |
| Identity | Real account from Milestone 1 | Attempts, review state, export/deletion, and pairing need a durable owner. |
| Curriculum evidence | Versioned provenance and release workflow | A URL alone cannot distinguish confirmed facts from inference. |
| AI failure behavior | Save attempt first; bounded retry; reject invalid model output; deterministic or queued recovery; no silent provider switch | Protects learner evidence, cost, privacy, and trust. |
| AI topology | One tutor orchestrator plus deterministic tools | A multi-agent swarm would make learning state and failures harder to reason about. |
| Learning state | Trusted application code owns mastery, review dates, permissions, credentials, billing, and audit records | The model can recommend; it cannot mutate trusted state. |

## 3. What already exists

There is no application code, package manifest, database, test suite, deployment configuration, or existing user flow to reuse. `Premium_Prompt.md` is the only source artifact. Therefore:

- Reuse the prompt as the product requirements baseline, not as executable code.
- Create the architecture and documentation files before feature implementation.
- Do not pretend that the current repository has a working baseline; the first verification result is “no existing build/test commands.”
- Record all current framework, provider, and official-content research in `docs/decision-log.md` with access date.

## 4. Twelve-month target and delta

| Current state | This blueprint | Twelve-month ideal |
|---|---|---|
| One requirements document, no runtime | A tested PWA, deterministic learning engine, provenance-backed curriculum, provider gateway, and staged connector plan | A trustworthy independent preparation companion with high-quality delayed retrieval, secure local inference, clear uncertainty, and maintainable content operations |

The plan moves toward the ideal by making learning evidence and content provenance first-class. It avoids moving away from it by keeping AI, UI, curriculum, credentials, and analytics separate.

## 5. Architecture

### 5.1 Repository layout

Create the workspace during M0 so bootstrap, CI, and documentation are reproducible. M1 adds the executable web shell and identity; later packages remain deferred until their milestone needs executable code.

```text
/
  apps/
    web/                         # Next.js/React PWA and server routes
    desktop-connector/           # created in Milestone 12
    relay/                       # created only when iPhone pairing is implemented
  packages/
    shared-schemas/              # Zod schemas, discriminated unions, API DTOs
    learning-engine/             # deterministic evidence, mastery, scheduling
    tutor-agent/                 # orchestration and tool policy
    ai-gateway/                  # provider adapters and failure contract
    multicheck-curriculum/       # versioned domains, skills, sources, seed data
    content-grounding/           # source claims, release states, provenance
    review-scheduler/             # pure scheduling functions
    test-fixtures/               # deterministic users, activities, providers
    ui/                          # accessible shared components only when reused
    config/                      # TypeScript, lint, test, formatting presets
  db/
    migrations/
    seeds/
  docs/
    product-requirements.md
    learning-science.md
    multicheck-research.md
    curriculum-map.md
    architecture.md
    ai-provider-design.md
    local-connector-design.md
    threat-model.md
    evaluation-plan.md
    test-plan.md
    decision-log.md
    runbooks/
  e2e/
  scripts/
```

### 5.2 Runtime boundaries

Use a modular monolith. A framework version is not frozen by this document; the agent must research the current stable release, pin it, and record the decision.

Recommended baseline:

- TypeScript with strict mode.
- React-based server-rendered application framework with PWA support.
- PostgreSQL in hosted/staging/production; an isolated local database for development.
- Typed database access and migrations.
- Zod or an equivalent runtime schema validator.
- Playwright for end-to-end tests; a fast unit/integration runner for pure domain code.
- Secure, database-backed authentication with email verification and passkey support where the selected library supports it.
- `pnpm` workspace. Do not start with microservices.

M0 must leave a reproducible bootstrap transcript: install Node LTS and pnpm, create the workspace, start PostgreSQL via the documented local method, run migrations and seeds, run the test database, and build the web app from a clean clone. Define and validate an `.env.example` containing database URL, auth secret, public app URL, session/cookie settings, provider mode, usage budget, and optional connector settings. No real provider key is required for M0-M10.

The M0 bootstrap contract must include pinned Node/pnpm/framework/database/auth/test versions, a committed lockfile policy, one supported local database path (preferably Docker Compose), exact database names/ports, reset/migrate/seed/test commands, supported OSes, Playwright browser setup, and a cross-platform README. The default is `PROVIDER_MODE=mock` with a deterministic seed user and fixture. The first five-minute developer path is:

```text
corepack enable
pnpm install --frozen-lockfile
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm demo
```

`pnpm demo` must open a seeded diagnostic and complete one attempt -> mock feedback -> retry without a real provider key. The agent must replace placeholders with exact commands and versions in `docs/decision-log.md` before claiming M0 green.

```text
Browser/PWA
    |
    v
Web UI + route handlers -----> Auth/session boundary
    |                                  |
    v                                  v
Tutor application service ------> PostgreSQL
    |
    +--> Learning engine (pure deterministic functions)
    +--> Curriculum/provenance repository
    +--> AI gateway --> mock | hosted | local connector
    +--> Audit/usage event writer

Later only:
Desktop connector --> outbound authenticated relay --> web app
```

The web app must not import a concrete model vendor. The AI gateway depends on provider adapters; the tutor depends on the gateway interface; the learning engine depends on neither.

### 5.4 Durable asynchronous work

Use a durable database-backed job table and worker process for provider retries, offline reconciliation, question validation, scheduled review materialization, and cleanup. Jobs have an idempotency key, attempt count, exponential backoff, visibility timeout, dead-letter state, maximum payload size, and audit correlation ID. A worker may run twice; handlers must be safe to repeat. The first deployment may run the worker beside the web process, but the interface must allow a separate worker later.

### 5.3 Authentication and ownership

Milestone 1 creates an account and session. Every learner-owned query and mutation requires the authenticated account ID from the server session, never a client-supplied owner field. Add explicit authorization helpers such as `requireSession()` and `requireOwnedRecord()`. Add export and deletion before production hardening.

Export produces a machine-readable bundle of profile, curriculum versions used, attempts, feedback, mistake records, mastery, reviews, and settings, with credentials and secrets excluded. Deletion revokes sessions/devices, destroys encrypted provider credentials, removes queued/offline sync payloads, deletes learner-owned records, and keeps only legally required aggregate/audit records with personal content redacted. Test both operations with a seeded learner and verify no secret or orphaned queue record remains.

### 5.5 Contracts required before M1 implementation

M0 must produce an ERD and executable contract tables before feature code: entity cardinalities and tenant ownership; column types, enums, foreign keys, unique/check constraints, and indexes; append-only `Attempt`/`AttemptAnswer`/versioned `AttemptEvaluation` semantics; idempotency-key scope and retention; deletion/retention rules; and package dependency rules enforced in CI. Define exact state transitions, transaction boundaries, optimistic-lock/version behavior, cancellation terminals, and whether offline reconciliation appends a new attempt or returns an existing idempotent result. Durable jobs must specify lease/claim, at-least-once delivery, retry ordering, shutdown behavior, payload limits, and dead-letter inspection. The AI gateway must specify timeout, cancellation, budget, stream framing/backpressure, retry idempotency, versioned error envelopes, and confidence ranges. No adapter or repository may invent these semantics independently.

## 6. Core domain model

Implement the following tables/entities with stable IDs, created/updated timestamps, and account scoping where applicable:

In addition to the entities listed below, create `MistakeRecord` for the learner's mistake notebook.

`User`, `LearnerProfile`, `LanguagePreference`, `TargetExam`, `TargetOccupation`, `StudyPlan`, `CurriculumSource`, `CurriculumVersion`, `Domain`, `Skill`, `SkillDependency`, `LearningObjective`, `QuestionTemplate`, `GeneratedQuestion`, `Rubric`, `Activity`, `Attempt`, `AttemptAnswer`, `Feedback`, `HintUsage`, `ErrorClassification`, `MasteryState`, `ReviewSchedule`, `LearningSession`, `SessionEvent`, `MockExam`, `MockExamSection`, `MockExamAttempt`, `ProviderConfiguration`, `EncryptedCredential`, `ConnectorDevice`, `PairedClient`, `ModelConfiguration`, `UsageRecord`, and `AuditEvent`.

### 6.1 Invariants

- An `Attempt` is created before any model grading call.
- An attempt is immutable after submission except for explicitly versioned evaluation corrections.
- One account can read or mutate only its own learner records.
- A generated question cannot become learner-visible until validation passes.
- A curriculum mapping cannot be learner-visible until its source version is released.
- A claim's classification (`official-confirmed`, `official-general`, `inferred`) is separate from its lifecycle (`draft`, `released`, `rejected`, `superseded`). Only `releaseStatus = released` is learner-visible, and release requires a server-side reviewer role plus an audit event.
- A provider response cannot mutate trusted state until schema validation and business-rule validation pass.
- `ReviewSchedule.nextReviewAt` is computed by deterministic code, never accepted from model output.
- `MasteryState` stores an uncertainty interval or evidence-confidence value; sparse evidence must produce visibly uncertain readiness, not false precision.
- All mutation endpoints are idempotent by client request ID.

### 6.2 Mistake notebook

Every failed or fragile item creates a `MistakeRecord` containing the original question, learner answer, correct answer when known, error category, explanation, prerequisite, similar follow-up, next review date, and learner clarity state: `clear`, `partly_clear`, or `still_unclear`. The notebook is searchable by skill and preserves original evidence.

### 6.3 Generated question fields

Store generator model, prompt version, generation timestamp, skill mapping, target difficulty, expected answer, rubric, validation result, source provenance, human-review status, and whether the item has previously been shown.

## 7. Learning engine

### 7.1 Attempt-first state machine

```text
CREATED --> PRESENTED --> SUBMITTED --> EVALUATING -->
  +--> CORRECT --------> EVIDENCE_RECORDED --> REVIEW_SCHEDULED
  +--> PARTIAL --------> FEEDBACK_SHOWN --> RETRY_PENDING
  +--> INCORRECT ------> FEEDBACK_SHOWN --> RETRY_PENDING
  +--> UNGRADABLE -----> REVIEW_REQUIRED --> RETRY_PENDING or SUPPORT_NEEDED

Any state may receive CANCELLED only before persistence completes.
Duplicate submit, stale version, or post-finalization transitions are rejected.
```

The UI must not display a full solution before an attempt except for an explicit prior-example activity. The hint ladder is levels 0–4: no hint, direction, method, guided step, full worked solution. A full solution is followed by a similar unaided problem.

### 7.2 Evidence and mastery

Record skill ID, difficulty, correctness, hint level, response time, confidence, error category, unaided successes, assisted attempts, failures, current estimate, next review date, and history. Mastery requires evidence across multiple sessions, formats, increasing intervals, limited hints, and transfer where relevant. Never claim that one correct answer proves mastery.

Store `masteryEstimate`, `uncertainty`, `evidenceCount`, and `lastEvidenceAt`. Version a transparent uncertainty rule: sparse evidence starts wide; repeated independent evidence narrows it; hints, missing prerequisites, and stale reviews widen it. Progress and readiness must render an estimate plus uncertainty label, never a two-decimal score presented as fact.

### 7.3 Deterministic initial scheduler

Implement and unit-test a pure function with the prompt's initial policy:

- Incorrect: repeat in-session and within one day.
- Correct with strong hints: one to two days.
- Correct with a small hint: about three days.
- Correct unaided: about three to seven days.
- Repeated unaided success: progressively longer interval.
- Forgotten or fragile prerequisite: shorten interval and prioritize prerequisite.

Keep policy constants versioned. Do not introduce opaque machine learning scheduling until real evidence exists and an evaluation plan compares it with the deterministic baseline.

### 7.4 Daily selection

```text
due reviews -> fragile prerequisites -> current objective -> mixed exam-style task -> reflection -> schedule next review
```

Session lengths: 10, 20, 30 minutes, or custom. Confidence questions are sparse and used to detect overconfidence, not to replace performance evidence.

### 7.5 Self-explanation and interleaving rules

Ask for self-explanation when an answer is remembered without a reason, a procedure is memorized, a misconception repeats, a modified familiar problem fails, or confidence is high while performance is wrong. Store the explanation attempt as evidence and grade its rubric separately. Interleave only after related skills are individually usable; never mix completely unfamiliar skills merely to create difficulty. Add fixtures for each trigger and a guard that blocks premature interleaving.

## 8. Curriculum and content operations

### 8.1 Tracks

Shared foundation:

- German reading, vocabulary, grammar, spelling, and writing.
- Mathematics foundations through applied data.
- Logic, concentration, and delayed memory.

EBA track adds practical basic knowledge and the verified EBA domain set. Wirtschaft und Administration adds English, French or Italian, digital competencies, organisational ability, networked thinking, self/social competencies, and the verified WA domain set. Combined preparation stores shared skills once and links both tracks to them.

### 8.2 Skill graph

Seed prerequisite-aware mathematics first: arithmetic, fractions/decimals, percentages/proportions, measurement, geometry, algebra/patterns, data/applied mathematics. Seed German reading and grammar next, plus a minimal deterministic logic fixture so the first diagnostic can exercise a non-language domain. Add remaining domains by milestone, not as unvalidated bulk JSON.

Map mathematics to Zurich Lehrplan 21 areas: `Zahl und Variable`, `Form und Raum`, and `Grössen, Funktionen, Daten und Zufall`. Store source IDs and mapping status on each mapping.

### 8.3 Provenance workflow

```text
research note -> source captured -> mapping drafted -> claim classified -> review -> released version -> learner-visible content
                         |                                |
                         +--> stale/invalid -------------> rejected with reason
```

Store separate fields: `claimStatus` (`official-confirmed`, `official-general`, `inferred`) and `releaseStatus` (`draft`, `released`, `rejected`, `superseded`). Official claims require a source locator and reviewer. Inferred practical subtopics must be labelled inferred. A server-side reviewer/admin role alone may call the release/supersede API; the operation writes an audit event. Timings and structure are configurable and carry verification date; never hard-code an unverified duration.

### 8.4 Question validation pipeline

```text
select skill/difficulty
  -> generate structured candidate
  -> deterministic validator
  -> independent verifier when required
  -> duplicate/near-duplicate check
  -> language-level check
  -> provenance + unofficial label
  -> release or reject with reason
```

Mathematics is recalculated programmatically. Grammar stores accepted variants. Reading answers point to supporting passage spans. Situational judgement explains trade-offs and never labels a fixed personality trait.

## 9. Tutor and AI gateway contracts

### 9.1 Provider interface

```ts
interface AIProvider {
  id: string;
  providerType: "hosted" | "openai-compatible" | "ollama" | "lm-studio" | "mock";
  listModels(): Promise<ModelInfo[]>;
  testConnection(): Promise<ConnectionTest>;
  generate(request: GenerationRequest, signal?: AbortSignal): Promise<GenerationResult>;
  stream(request: GenerationRequest, signal?: AbortSignal): AsyncIterable<GenerationEvent>;
  generateStructured<T>(request: StructuredGenerationRequest<T>, signal?: AbortSignal): Promise<T>;
  embed?(request: EmbeddingRequest, signal?: AbortSignal): Promise<EmbeddingResult>;
  getCapabilities(): ProviderCapabilities;
}
```

Capabilities include streaming, structured output, tools, vision/audio, embeddings, context limit, local/remote, and cost metadata. All model output uses discriminated, schema-validated commands. Invalid, empty, refused, or out-of-contract results are rejected and recorded as provider failures.

### 9.2 Tutor decision contract

```ts
type TutorDecision = {
  activityId: string;
  evaluation: "correct" | "partially_correct" | "incorrect" | "ungradable";
  rubricResults: { criterionId: string; passed: boolean; evidence: string }[];
  errorCategory?: string;
  hintLevel: 0 | 1 | 2 | 3 | 4;
  feedback: {
    whatWasCorrect: string;
    whatWasWrongOrMissing: string;
    why: string;
    nextAction: string;
    correctedExample?: string;
  };
  nextAction: "retry_same" | "try_similar" | "teach_prerequisite" | "schedule_review" | "continue";
  confidence: number;
};
```

The application clamps confidence, validates that the activity belongs to the authenticated learner, validates hint progression, and computes evidence/mastery/scheduling itself. The model cannot write credentials, permissions, billing, owner IDs, audit records, mastery, or review dates.

Feedback is structured as `whatWasCorrect`, `whatWasWrongOrMissing`, `why`, `nextAction`, and an optional corrected example. The UI must render each field distinctly and reject empty praise-only feedback. Study mode permits hints, retry, worked examples, full solutions under the attempt-first policy, translation, and unlimited time unless speed is the skill. Practice/mock mode disables hints and translations, records skips, delays explanations until the section ends, and produces post-test error analysis.

### 9.3 Provider failure contract

```text
persist attempt -> call provider ->
  success + valid schema: apply bounded decision
  timeout/429: retry with backoff, then queue/recover visibly
  malformed/empty/refusal: reject, log, deterministic fallback only when the activity declares fallback capability; otherwise UNGRADABLE + queued retry
  credential/config error: show repair action; never silently switch provider
```

Numeric and other independently verifiable activities may have deterministic grading. Open writing, reading, and explanation activities must remain `UNGRADABLE` when no trusted fallback exists; they must never be marked correct by an outage path.

Use typed errors: `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `RateLimitError`, `ProviderTimeoutError`, `ProviderUnavailableError`, `MalformedProviderOutputError`, `BudgetExceededError`, `PersistenceError`, `SyncConflictError`, and `CancellationError`. Every adapter must stop work on `AbortSignal`, close streams, release resources, and leave no duplicate mutation. Never catch a generic error and continue silently.

### 9.4 Hosted and user-configured providers

Support application-owned server credentials, encrypted user-provided API credentials, session-only keys, and custom OpenAI-compatible hosted endpoints. Settings must provide test, replace, and delete operations without ever reading a stored key back to the client. Show provider/model, connection state, local-versus-cloud status, approximate privacy/cost implications, usage limits, measured or estimated usage where available, and the explicit fallback policy. Add acceptance tests for invalid credentials, key replacement/deletion, secret redaction, custom-endpoint URL policy, and “no credential read-back.”

## 10. User journeys and UX contract

### 10.1 Screens

```text
sign in -> onboarding -> short diagnostic -> home
                                         |
                   +---------------------+---------------------+
                   v                     v                     v
              daily session         study mode          practice/mock
                   |                     |                     |
                   +--> attempt -> feedback/retry -> progress/mistake notebook
```

Home shows continue session, due reviews, target exam, domain readiness with uncertainty, weakest prerequisite, model status, and exam date. Learning screen shows the question, progress, relevant timer, input, submit, hint, “I do not understand,” and “Explain differently.” Progress shows trends and next action, not fake precision.

### 10.2 Onboarding and target matrix

Keep onboarding short, then immediately start the diagnostic. Collect target exam, target apprenticeship, preferred second foreign language, intended exam date if known, minutes per day, interface language, explanation language, and self-reported weak areas. The target selector must support exactly: `EBA only`, `Wirtschaft und Administration only`, `combined preparation`, `Kaufmann/Kauffrau EBA`, and `Kaufmann/Kauffrau EFZ`. Shared skills are linked once; occupation-specific plans add modules. Add an E2E test for each choice and a test that a missing optional exam date does not block the diagnostic.

### 10.3 Language settings

Separate interface, explanation, question, and feedback languages. Support German, English, and Persian. Immersion levels 1–3 and German-only exam mode must be explicit. Never translate or reveal a target answer before submission.

### 10.4 Required UI states

| Feature | Loading | Empty | Error | Partial/offline | Success |
|---|---|---|---|---|---|
| Diagnostic | skeleton + cancel | explain no questions | retry/restart | save pending attempt | show skill evidence |
| Learning activity | question placeholder | explain unavailable activity | preserve attempt | queue if safe | feedback and retry |
| Progress | cached last view | first-session guidance | show stale marker | local-only indicator | updated evidence |
| Provider settings | connection spinner | no provider configured | typed repair action | local/offline state | visible provider/model |
| Mock exam | section preamble | no released pool | stop before start | resume policy | delayed analysis |

### 10.5 Accessibility and mobile

Keyboard navigation, visible focus, screen-reader labels, reduced motion, text zoom, safe-area handling, touch targets, virtual-keyboard-aware inputs, no hover-only actions, and mobile viewport tests are release gates.

### 10.6 Design and internationalisation contract

Before M1 shell work, create `docs/design-system.md` and a route map. Define typography and font fallbacks, CSS tokens for spacing/radii/elevation/status colors, primary-action hierarchy, component states, WCAG 2.2 AA contrast, dark/high-contrast behavior, and a no-card-mosaic rule: a card exists only when it supports a real action or comparison. Define desktop/mobile layouts at 1280, 768, and 375 CSS pixels, navigation ordering, sticky controls, exam timer hierarchy, focus restoration, live-region announcements, and reduced-motion behavior.

Persian is an explicit RTL contract, not only a translation option: set `dir` and `lang` per document/region, use logical CSS, mirror directional icons, isolate mixed German terms, preserve math/numeric direction and locale formatting, define punctuation and line-break rules, persist language changes safely, and test mixed Persian/German screens at all three viewports. Feedback copy must be calm and no-shame for wrong, partial, ungradable, uncertain, and provider-failure states. Home has one primary CTA; secondary readiness, model, and exam details are progressively disclosed rather than rendered as a dashboard mosaic.

## 11. Offline and connector roadmap

Milestone 1 PWA caching includes shell, opened lessons, previously generated validated questions, saved explanations, due-review metadata, non-sensitive settings, and unsynchronized attempts. Never cache API keys or secret material. Offline mode must say when cloud or PC inference is unavailable. Test offline review of a saved explanation and a queued answer after refresh.

Milestone 12 adds a signed/lightweight desktop connector for Ollama, LM Studio, and generic OpenAI-compatible localhost servers. Bind local services to loopback; never expose model ports publicly. The connector UI includes recent-request visibility and a “pause all remote access” control. Milestone 13 adds one-time QR pairing, device credentials, expiry, replay protection, authenticated outbound relay, rate limits, revocation, and visible local-model state. The iPhone must never attempt to use its own `localhost` for the PC model. Do not claim end-to-end encryption unless the relay path is actually implemented and audited; document what the relay can read.

For browser-to-loopback calls, require an origin-bound handshake: the connector serves a short-lived nonce only to an allowed web origin, the browser displays a user confirmation, and every request carries a device-bound token plus CSRF/origin proof. Reject arbitrary `Origin`, `Host`, and cross-site requests. Test drive-by localhost requests, wrong origins, expired tokens, and user-approved pairing.

## 12. Security threat model

| Threat | Risk | Required control | Verification |
|---|---|---|---|
| API-key exposure | High | server-side secrets, encryption at rest, session-only option, redaction | secret scan + integration test |
| Broken object authorization | High | derive owner from session, ownership query helper | cross-account E2E test |
| Prompt injection in source text | High | isolate source content, tool allowlist, treat documents as data | fixture with hostile instructions |
| Unsafe custom endpoint SSRF | High | block loopback/private/link-local from cloud; allow only trusted connector local targets | URL policy unit tests |
| Malicious Markdown/XSS | High | sanitize rendered Markdown and CSP | payload corpus E2E test |
| Pairing replay/impersonation | High | expiring one-time code, device binding, rotation, revocation | connector security suite |
| Cost abuse | Medium | per-user budget, rate limits, request/response limits | load and budget tests |
| Duplicate streamed action | Medium | idempotency key and state version | concurrent submit test |
| Sensitive logs | High | structured redaction and audit classification | log snapshot test |
| Cross-user leakage | High | account-scoped repositories and authorization tests | seeded two-user suite |
| CSRF/session abuse | High | HTTPS, secure HTTP-only same-site cookies, origin/CSRF checks on mutations | browser mutation tests |
| Malicious uploads/documents | High | no uploads in the first slice; if introduced, strict type/size limits, malware scanning, sandboxed parsing, and provenance isolation | upload-policy tests |
| Model-generated executable content | High | render as inert text/data only; no shell, file, or code execution tools | hostile-output fixture |
| Unsafe redirects/oversized provider responses | Medium | allowlist redirects, cap response size and duration, abort on limit | gateway integration test |

## 13. Error and rescue registry

| Codepath | Failure | Typed error | Rescue action | User sees |
|---|---|---|---|---|
| Submit attempt | duplicate request | `ConflictError` | return prior result by idempotency key | “This attempt was already submitted.” |
| Submit attempt | stale activity version | `ConflictError` | reload activity; preserve draft | “This activity changed; your answer is safe.” |
| Persist evidence | database unavailable | `PersistenceError` | retry transaction; local queue only when integrity is known | “Saved locally; syncing is pending.” |
| Provider call | timeout | `ProviderTimeoutError` | bounded retry, then visible queued/recovery state | “The tutor provider took too long.” |
| Provider call | 429/budget | `RateLimitError` or `BudgetExceededError` | backoff or stop; no alternate provider | “Provider limit reached; choose how to continue.” |
| Provider call | invalid JSON/schema | `MalformedProviderOutputError` | reject, record, deterministic fallback/retry | “The tutor response was invalid; your attempt is safe.” |
| Provider call | refusal/empty result | `ProviderUnavailableError` | classify and recover; never grade as correct | “No usable tutor response was returned.” |
| Curriculum lookup | no released activity | `NotFoundError` | select another released skill; log gap | “No activity is available for this skill yet.” |
| Auth | expired session | `AuthenticationError` | redirect without losing local draft | “Your session expired; sign in again.” |
| Authorization | foreign record ID | `AuthorizationError` | return generic not-found response and audit event | “That item is unavailable.” |
| Connector | offline/unpaired | `ProviderUnavailableError` | keep learner in explicit local/offline state | “Connector is offline or not paired.” |
| Sync | conflict | `SyncConflictError` | compare idempotency/version; never overwrite evidence | “We kept both records and need to reconcile.” |

## 14. Data-flow shadow paths

### 14.1 Attempt flow

```text
answer input -> schema validation -> create immutable attempt -> grade -> validate decision -> evidence transaction -> schedule -> UI
     | nil/empty          | wrong type/too long       | DB failure       | malformed/empty       | conflict          | stale output
     v                    v                           v                 v                      v                  v
 clear validation error  no provider call             retry/queue       reject + recover       rollback tx       refetch/version check
```

### 14.2 Offline flow

```text
input -> local validation -> local pending record -> reconnect -> idempotent upload -> server evidence -> mark synced
  | empty/invalid          | storage full         | refresh            | duplicate            | server rejected
  v                        v                      v                   v                     v
 user correction          visible local error     retain draft         return prior result   keep pending + show reason
```

### 14.3 Provider flow

```text
request -> provider capability check -> bounded call -> stream parse -> schema validate -> application command
   | nil model | unsupported capability | timeout/429 | empty/malformed | invalid transition
   v           v                       v             v                 v
 repair       choose supported path   retry/queue   deterministic recovery reject + audit
```

## 15. Interaction edge-case registry

| Interaction | Edge case | Required behavior |
|---|---|---|
| Submit | double-click | disable after first request; idempotency key returns one result |
| Submit | navigate away | persist draft/attempt state; warn only when data would be lost |
| Submit | slow network | progress state with cancel; never duplicate |
| Hint | repeated clicks | monotonically increase level; log each use |
| Exam | back button/refresh | persist section state; enforce configured pause policy |
| Exam | answer revelation | hide feedback and translations until section completion |
| Progress | zero records | onboarding guidance, not a fabricated score |
| Progress | stale cache | show timestamp and refresh action |
| Provider | switch while request runs | cancel old request; require explicit new request |
| Connector | revoke during stream | terminate stream and record audit event |
| Sync | reconnect after duplicate upload | idempotent response, no second attempt |
| Mobile | keyboard covers input | scroll/focus into view and preserve answer |

## 16. Verification strategy

### 16.1 Test pyramid

```text
many pure unit tests: scheduler, mastery, validators, curriculum graph, URL policy
fewer integration tests: repositories, auth, provider gateway, migrations, sync
few deterministic E2E tests: onboarding, diagnostic, attempt/retry, progress, mock exam, mobile viewport
```

Every new codepath receives a happy-path, nil/empty/boundary, and named failure test. AI tests use fixtures and recorded structured responses; no test depends on a live provider.

### 16.2 Required acceptance tests

- Attempt is required before a solution; hints do not reveal the answer prematurely.
- Incorrect and partial responses produce actionable feedback and retry.
- Assisted correctness is weaker evidence than unaided correctness.
- One correct response cannot establish mastery.
- Failed and fragile skills are scheduled earlier; repeated success lengthens intervals.
- Exam mode delays hints, translation, and correction.
- Self-explanation triggers fire for repeated misconceptions, memorized procedures, modified-problem failures, and high-confidence errors; unfamiliar skills are not interleaved prematurely.
- Mistake notebook preserves the original/learner/correct answer, prerequisite, follow-up, next review, and `clear`/`partly_clear`/`still_unclear` state.
- EBA and WA domains remain distinct; shared skills are not duplicated.
- All five target choices work: EBA only, Wirtschaft und Administration only, combined, Kaufmann/Kauffrau EBA, and Kaufmann/Kauffrau EFZ.
- Every learner-visible skill and generated item has provenance or an explicit inferred/unofficial label.
- Only an authorized reviewer can release or supersede a mapping; the action is audited.
- Sparse evidence renders visible uncertainty; export/deletion removes secrets, queued payloads, and learner-owned records according to the documented contract.
- Hosted keys never reach frontend code, local storage, logs, or API responses.
- Hosted-provider settings support app-owned keys, user keys, custom compatible endpoints, test/replace/delete, usage/cost/fallback display, invalid-key recovery, and no credential read-back.
- Malformed model output cannot mutate trusted state; no silent paid fallback.
- Two users cannot read or mutate one another's records.
- Connector pairing expires, cannot replay, and can be revoked.
- Browser-to-loopback connector requests require an origin-bound, user-approved handshake and reject drive-by localhost calls.
- PWA shell and pending attempts survive refresh; reconnect does not duplicate attempts.
- Mathematics is recalculated; reading answers cite passage spans; grammar supports valid variants; ambiguous questions are rejected.

### 16.3 Commands the agent must run

After each vertical slice, run the repository's pinned equivalents of:

```text
format check
type check
lint
unit tests
integration tests
Playwright E2E tests
production build
dependency/security audit
mobile viewport smoke tests
```

Record exact commands, environment, duration, and actual result in the milestone report. Never claim a command ran if it did not.

The first-slice handoff must also commit a root `README.md`, docs index, `.env.example` table with exact variable names/defaults and public/server-only classification, CI workflow and required checks, database reset/seed commands, a dev-only auth/test user, Playwright browser setup, and troubleshooting runbooks for database, migration, auth, mock-provider, E2E traces, and stuck jobs. Add `pnpm demo` as the single smoke command with a deterministic URL and expected output. Minimum request IDs, a health endpoint, redacted local logs, and job inspection belong in M0/M1 so the first slice is debuggable rather than merely specified.

## 17. Performance and observability

### Performance budgets

- Server-rendered shell: define and measure a p75/p95 target before release.
- Attempt submission excluding provider latency: target p95 under 500 ms in staging.
- Provider timeout: bounded and configurable; never hold a request indefinitely.
- Pagination for progress, mistake notebook, and audit views; no unbounded list fetch.
- Index `(user_id, next_review_at)`, `(user_id, created_at)`, skill dependencies, idempotency keys, and provider usage time windows.
- Stream chunks without buffering an entire response in memory; cap request and response sizes.

### Day-one telemetry

Emit structured events with request ID, session ID, account-safe identifier, activity ID, provider ID (not secrets), latency, outcome, retry count, and error class. Redact answers and personal text by default.

Metrics:

- attempt submission success/failure and duplicate rate;
- delayed unaided retrieval and hint dependence;
- provider latency, timeout, malformed-output, and budget events;
- sync queue depth and conflict rate;
- question validation rejection rate;
- crash-free sessions and mobile layout failures.

### 17.1 Learning evaluation matrix

| Fixture | Expected evidence |
|---|---|
| correct unaided retrieval | high evidence, longer review interval, lower uncertainty over time |
| partially correct response | rubric-level feedback, retry or prerequisite route |
| wrong method versus arithmetic slip | distinct error category and different next activity |
| repeated German misconception | self-explanation trigger and prerequisite remediation |
| multiple valid language answers | accepted variant, no false negative |
| unsupported tutor claim | claim rejected or marked uncertain; no trusted-state mutation |
| ambiguous question | candidate rejected before learner presentation |
| overconfident learner | confidence/performance mismatch recorded without identity judgement |
| missing prerequisite | easier prerequisite activity selected before dependent skill |
| Persian explanation with German terminology | explanation language changes without exposing target answer early |
| prompt injection in source text | source treated as data; no unauthorized tool action |
| local model without tool calling | capability mismatch and visible recovery |
| malformed local JSON | typed rejection, safe fallback or `UNGRADABLE`, no silent success |

Primary outcome measures are delayed correct retrieval, unaided accuracy, repeated-error reduction, hint dependence, time to independent correctness, interval retention, mock-exam improvement, and timed accuracy. Engagement, messages, streaks, and notification clicks remain secondary.

Alerts: persistence failure rate, provider malformed-output spike, queue age, auth error spike, cross-account authorization failures, and budget exhaustion. Create runbooks for each alert.

## 18. Deployment and rollback

### Sequence

```text
research/content release -> migration expand -> deploy compatible code -> smoke tests -> enable feature flag -> observe -> contract/cleanup migration
```

Use backward-compatible expand/contract migrations. Feature-flag diagnostic, provider integrations, and exam simulations independently. Staging must exercise two users, mobile viewport, offline queue, and provider failure fixtures.

### First five minutes

- Health endpoint and database connectivity.
- Auth sign-in and session refresh.
- Create/submit one mock attempt.
- Verify evidence and review schedule rows.
- Verify no secret values in logs.
- Check provider error and queue metrics.

### Rollback

1. Disable the affected feature flag.
2. Stop new writes only if data integrity is at risk.
3. Roll back application code to the last compatible version.
4. Do not destructive-rollback a migration; use a forward fix unless a tested reversible migration exists.
5. Reconcile queued attempts with idempotency keys.
6. Record incident, impact, and recovery in `docs/runbooks/`.

## 19. Build milestones and exit gates

Each milestone is a vertical slice. Do not start the next milestone while its exit gate is red.

### M0 — Foundation and research

Create the workspace, pinned toolchain, README/bootstrap path, CI skeleton, documentation set, source/research log, threat model, ERD/schema contract, attempt/job/provider contracts, test plan, architecture decision record, and baseline report. Exit: a clean clone can run the mock demo and checks; all research claims have sources/status; no live credentials required.

### M1 — Installable shell and identity

Responsive PWA, account/session, navigation, settings, language preferences, all five target choices, target apprenticeship, exam-date/minutes-per-day capture, weak-area capture, accessibility shell, database migrations, smoke test. Exit: a new account can sign in, choose any target, refresh, and retain settings on desktop and iPhone viewport before a short diagnostic starts.

### M2 — Deterministic mock provider

Provider interface, mock models, streaming simulation, structured-output fixtures, timeout/429/malformed/refusal fixtures, redacted logs. Exit: all tutor tests run without a real API key.

### M3 — Curriculum and skill graph

Versioned source records, EBA/WA domains, shared dependencies, mathematics, German, and minimal logic seed modules, release workflow, seed validation. Exit: a released skill can be selected by ID and its provenance is shown in internal/admin views.

### M4 — Core tutor slice

Select exam -> diagnostic question -> skill identification -> activity -> attempt -> feedback -> retry -> evidence -> review schedule -> progress. Exit: complete flow works with mock provider, German question, Persian explanation mode, desktop and iPhone viewport, and failure fixtures.

### M5 — Adaptive diagnostic

Short multi-domain diagnostic, prerequisite detection, difficulty adjustment, confidence capture, initial plan, uncertainty report. Exit: seeded learner fixtures produce predictable next-activity choices.

### M6 — Mathematics

Arithmetic, fractions/decimals, percentages, ratios, measurement, geometry, algebra/patterns, tables/charts, word problems, estimation, timed practice, programmatic validators. Exit: generated numeric answers are independently recalculated and ambiguous items rejected.

### M7 — German

Reading, vocabulary, grammar, spelling, correction tasks, writing rubric, timed work, bilingual Persian explanations. Exit: passage evidence and accepted grammar variants are tested; answer translation never precedes submission.

### M8 — Cognitive modules

Logic, concentration, delayed memory, coordinate/comparison tasks, speed-accuracy metrics. Exit: delayed retrieval occurs after intervening activity and fast random clicking is not rewarded.

### M9 — EBA preparation

Verified EBA domains, practical basic knowledge, study plan, section practice, original simulation, post-test analysis. Exit: no inferred category is labelled official.

### M10 — Wirtschaft und Administration

English, French/Italian selection, digital competencies, organisational ability, networked thinking, self/social competencies, WA plan and simulation. Exit: selected second language and track-specific domains remain isolated and testable.

### M11 — Hosted providers

One hosted provider, server-side or encrypted user key, session-only key, model selection, streaming, structured output, timeout/cancel, budgets, redaction. Exit: security tests prove keys do not reach frontend, local storage, logs, or responses.

### M12 — Desktop local connector

Tauri/lightweight companion, Ollama/LM Studio/OpenAI-compatible localhost detection, model list, stream/cancel, loopback defaults, pairing/revocation, offline recovery. Exit: unpaired and revoked clients fail; local model state is visible.

### M13 — iPhone-to-PC inference

QR pairing, outbound authenticated relay, device identity, expiry, replay protection, streaming, revocation, offline states. Exit: iPhone never targets its own localhost; relay content/privacy behavior is documented honestly.

### M14 — Full exam system

Section timers, no-hint mode, skipped questions, configurable verified structure, original pools, post-test diagnosis, trend comparison, uncertain readiness estimate. Exit: explanations are delayed until section end and accidental answer revelation is tested.

### M15 — Production hardening

Authorization and credential audit, connector review, rate limits, budgets, backups, export/deletion, accessibility audit, Mobile Safari audit, recovery testing, deployment docs. Exit: definition of done in `Premium_Prompt.md` is evidenced by test reports, not assertions.

## 20. Agent operating loop

The implementing agent must repeat this loop and continue until the current milestone is green:

1. Inspect current files, docs, commands, and open work.
2. Research unstable facts using primary sources; record URL/date/decision.
3. Select one smallest end-to-end vertical slice.
4. Write acceptance criteria, non-goals, affected modules, risks, and tests.
5. Implement strict, explicit code with loading, empty, error, cancellation, and mobile states.
6. Run formatter, type-check, lint, unit, integration, E2E, build, security, and mobile checks.
7. Review learning behavior, curriculum provenance, security, provider coupling, accessibility, races, duplicate submissions, and cost.
8. Repair failures attributable to the slice. Never weaken tests to make green.
9. Update setup, architecture, environment variables, migrations, provider docs, local connector docs, limitations, and source versions.
10. Report actual work and choose the next smallest slice.

Required report shape:

```text
Milestone:
Vertical slice:
Completed:
Files changed:
Tests executed:
Results:
Security review:
Learning-behaviour review:
Mobile/accessibility review:
Known limitations:
Next vertical slice:
```

## 21. NOT in scope for this blueprint's first implementation branch

- Multi-agent tutor swarms: one orchestrator is sufficient until evidence shows a need.
- Microservices: modular boundaries and contract tests come first.
- Automatic paid-cloud fallback: violates consent and cost transparency.
- Proprietary or reconstructed Multicheck content: prohibited by the product boundary.
- Personality diagnosis from one situational answer: not a valid learning claim.
- Opaque learned scheduler before a deterministic baseline and real evaluation data.
- Social feeds, streak pressure, ads, payments, employer dashboards, or classroom administration.
- Public exposure of local model ports or unauthenticated LAN inference.
- Native mobile app before the PWA and iPhone connector flow prove their value.

## 22. Failure modes registry

| Codepath | Failure mode | Rescued? | Test? | User sees? | Logged? |
|---|---|---:|---:|---|---:|
| Attempt persistence | DB outage | Yes, bounded retry/queue | Yes | Explicit pending state | Yes |
| Grading | malformed model output | Yes, reject/recover | Yes | Invalid-response recovery | Yes |
| Grading | model grades without attempt | Prevented by state machine | Yes | No answer reveal | Yes |
| Review scheduler | invalid interval/state | Yes, invariant error | Yes | Safe default/manual retry | Yes |
| Auth | expired session | Yes | Yes | Sign-in recovery | Yes |
| Authorization | foreign ID | Yes, generic not-found | Yes | No data disclosure | Yes |
| Content | unverified mapping | Prevented by release gate | Yes | Not learner-visible | Yes |
| Provider | timeout/429 | Yes, bounded recovery | Yes | Provider status | Yes |
| Connector | unpaired/revoked | Yes | Yes | Pair/reconnect action | Yes |
| Offline sync | duplicate/conflict | Yes, idempotent reconcile | Yes | Sync status and reason | Yes |
| Mobile UI | keyboard/refresh | Yes | Yes | Preserved draft/state | Yes |
| Durable worker | crash/retry/duplicate job | Yes, visibility timeout and idempotent handler | Yes | Pending/retry status when learner-visible | Yes |

## 23. Implementation tasks

These are the actionable tasks derived from the review. P1 blocks the first production-capable slice; P2 belongs in the same branch; P3 is a later milestone task. T0 is the prerequisite contract/bootstrap gate; T7 depends on released seed content from T8 even though the historical task labels remain for traceability.

- [ ] **T0 (P1)** — resolve the M0 bootstrap, hosting/privacy, ERD/schema, attempt/job/provider, design-system, and CI contracts. Produce README, `.env.example`, Docker/test-database path, `docs/decision-log.md`, and the executable test-plan artifact before feature code.

- [ ] **T1 (P1, human: 1–2 days / agent: 1–2 h)** — bootstrap `pnpm` workspace, strict TypeScript, web app, shared schemas, test runner, and CI checks. Verify clean install, type-check, lint, unit test, and production build.
- [ ] **T2 (P1, human: 2–3 days / agent: 2–4 h)** — create authentication/session and account-scoped repository helpers. Verify two-user authorization tests and session expiry recovery.
- [ ] **T3 (P1, human: 2–4 days / agent: 3–6 h)** — create migrations for curriculum, activity, attempt, evidence, mastery, review, job, and audit records. Verify migration forward path and seed rollback strategy.
- [ ] **T4 (P1, human: 2–3 days / agent: 3–5 h)** — implement immutable attempt state machine and idempotent submission. Verify double-click, stale version, cancellation, and persistence failure.
- [ ] **T5 (P1, human: 2–3 days / agent: 2–4 h)** — implement pure mastery, uncertainty, and deterministic scheduler functions. Verify nil, empty, hint-weighted correctness, forgotten skills, and interval progression.
- [ ] **T6 (P1, human: 2–4 days / agent: 3–6 h)** — implement mock AI provider and schema-validated tutor decision pipeline. Verify timeout, 429, malformed, empty, refusal, cancellation, and invalid transition fixtures.
- [ ] **T7 (P1, human: 4–7 days / agent: 6–10 h)** — implement the M4 diagnostic-to-retry vertical slice with progress update after T8. Verify German question, Persian explanation, answer-before-solution rule, desktop/iPhone viewports, and offline draft.
- [ ] **T8 (P1, human: 2–4 days / agent: 3–6 h)** — implement curriculum source/version/release workflow, reviewer authorization, and seed mathematics/German/logic foundation. Verify all released mappings have provenance and inferred content is labelled. This must precede the first real diagnostic slice.
- [ ] **T9 (P2, human: 3–5 days / agent: 4–8 h)** — add question validation pipeline and deterministic mathematics/reading/grammar validators. Verify ambiguity, duplicates, units, passage support, and valid answer variants.
- [ ] **T10 (P2, human: 2–4 days / agent: 3–6 h)** — add structured logs, metrics, redaction, health checks, durable worker jobs, and runbooks for persistence, provider, auth, sync, and content failures.
- [ ] **T11 (P2, human: 2–4 days / agent: 3–6 h)** — add PWA shell, cache policy, pending-attempt queue, keyboard/focus/mobile accessibility tests, and reconnection idempotency.
- [ ] **T12 (P3, human: 1–2 weeks / agent: 2–4 days)** — implement hosted-provider security, consent, credentials, budgets, and cancellation after the mock flow is green.
- [ ] **T13 (P3, human: 3–4 weeks / agent: 4–7 days)** — implement desktop connector, origin-bound loopback handshake, local model adapters, recent-request view, and pause-all-remote-access control.
- [ ] **T14 (P3, human: 4–6 weeks / agent: 5–10 days)** — implement authenticated iPhone-to-PC relay pairing, revocation, privacy documentation, and chaos/security tests.
- [ ] **T15 (P3, human: 2–4 weeks / agent: 4–8 days)** — complete full simulations and production hardening only after curriculum research is current and released.

## 24. Completion summary

| Review item | Result |
|---|---|
| Mode | HOLD SCOPE |
| System audit | Greenfield workspace; only `Premium_Prompt.md`; no build/test baseline |
| Architecture | Staged `pnpm` workspace, modular monolith, authenticated web-first delivery |
| Error map | Typed provider, persistence, auth, authorization, curriculum, connector, and sync failures |
| Security | Threat model, account ownership, secret handling, SSRF, prompt injection, pairing, cost controls |
| Data/interaction | Attempt, provider, offline, sync, exam, mobile, and stale-state shadow paths |
| Testing | Unit/integration/E2E pyramid with deterministic provider fixtures and mobile checks |
| Performance | Query indexes, bounded streams, pagination, budgets, p95 targets to be measured at baseline |
| Observability | Structured events, metrics, alerts, dashboards, runbooks, redaction |
| Deployment | Expand/contract migrations, flags, staging, smoke checks, forward rollback |
| Long-term | Domain boundaries support curriculum growth and connector addition without a rewrite |
| UX | Onboarding, attempt-first learning, progress, bilingual settings, exam mode, accessibility, PWA |
| Unresolved decisions | Founder/legal launch gates are explicit; framework/provider versions remain agent-owned M0 research gates |

## AUTOPLAN REVIEW ADDENDUM

Autoplan was run against this canonical file on 2026-07-20. The prior CEO decisions were inherited as settled premises. Design mockups were skipped because the local design and browser binaries were unavailable; the design phase therefore used a text-only review. Both independent review voices were run for CEO, design, and DX; the engineering CLI voice timed out after producing no final report, so the engineering consensus uses the completed engineering-agent review plus the earlier Codex engineering findings already recorded in this file.

| Phase | Codex voice | Agent voice | Score | Result |
|---|---|---|---:|---|
| CEO / strategy | PASS — conditional | CLEAR WITH CONDITIONS | 7.5/10 | Approve M0–M4 internal alpha; hold public/paid launch until wedge, minor/privacy, content-owner, and pilot gates are explicit. |
| Design / UX | PASS with blockers | PASS with blockers | 6.0/10 | Functional shell is coherent; add design system, route/CTA hierarchy, responsive contract, emotional copy, and RTL/bidi rules before polished UI. |
| Engineering | CLI timed out; no final voice | PASS with blockers | 6.8/10 | Architecture is sound; M0 must pin toolchain and make schema, state, job, gateway, security, ops, and test contracts executable. |
| Developer experience | PASS with blockers | PASS with blockers | 4.5/10 | Add the clone-to-demo bootstrap, local database path, env table, CI workflow, README, troubleshooting, and deterministic smoke fixture. |

### Cross-phase fixes applied

- The first shippable promise is now an internal-alpha German/mathematics learning loop, with measurable pilot thresholds and a stop/continue rule; the full roadmap is not presented as launch-ready.
- Minor/guardian, Swiss privacy, provider-transfer, retention, support, abuse, and trademark checks are explicit external-release gates.
- M0 now owns workspace/bootstrap creation and must produce the ERD, executable schema/state/job/provider contracts, design-system contract, README, CI skeleton, and test plan. The old M0/M1 workspace contradiction is resolved.
- A copy-paste `pnpm demo` path, mock-first environment, local database contract, and first-slice debugging artifacts are required before M0 can be green.
- The review test matrix is captured at `C:\Users\Mr.X\.gstack\projects\Adaptive-Learning-Tutor\unknown-autoplan-test-plan-20260720-0210.md`; the implementing agent must copy the relevant contract into `docs/test-plan.md` when the workspace is bootstrapped.
- The learning state, scheduler, offline reconciliation, and durable-job semantics must be made exact before implementation; no adapter may invent lifecycle or idempotency behavior.
- The design contract now requires route hierarchy, one primary CTA per screen, 375/768/1280 layouts, WCAG 2.2 AA behavior, calm failure copy, and explicit Persian RTL/bidi handling.

### Auto-decisions and deferred founder gates

| Decision | Classification | Autoplan choice | Rationale |
|---|---|---|---|
| Internal alpha wedge | Auto-decided scope refinement | German + mathematics, one track, M4/M5 | Highest learning signal with the smallest blast radius; preserves the approved modular-monolith direction. |
| Public/paid launch | Deferred founder gate | Do not launch until pilot thresholds and legal gates pass | A public claim would outrun the evidence in the current greenfield workspace. |
| Toolchain versions | Agent-owned research gate | Pin at M0 and record sources/date | Version choice is unstable and reversible; the plan must not invent stale versions. |
| Local database path | Auto-decided implementation default | Docker Compose plus isolated test database | Lowest setup variance for a fresh agent; native alternatives can be documented later. |
| Design visual direction | Auto-decided implementation default | Calm utility UI, no card mosaic, one CTA, semantic tokens | Directly addresses AI-slop and learner-anxiety risk without expanding product scope. |
| Persian layout | Auto-decided implementation requirement | Explicit RTL/bidi contract and viewport tests | Required for a promised language, not optional polish. |
| Task dependency | Auto-decided sequencing | Released seed curriculum before first real diagnostic | A diagnostic cannot be deterministic without released content. |
| External legal posture | Deferred founder/legal gate | Age, consent, privacy, retention, residency, support, and trademark review before beta | Material user-safety decisions cannot be silently guessed by an implementation agent. |

**Autoplan verdict:** CONDITIONAL PASS. The blueprint is implementation-ready for M0 discovery/bootstrap and an internal M4/M5 alpha after the new contracts are written. It is not yet a truthful claim of production or public-launch readiness. Remaining founder/legal gates are intentionally visible rather than reported as zero unresolved decisions.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---:|---|---|
| CEO Review | `/plan-ceo-review` | Scope and strategy | 1 | CLEAR | HOLD_SCOPE; staged workspace, account identity, provenance gate, safe provider recovery approved |
| Codex Review | `/plan-ceo-review` | Independent second opinion | 3 | PASS | 11 issues caught and fixed; final quality score 9.5/10 |
| Autoplan CEO | `/autoplan` | Strategy and launch conditions | 2 voices | CONDITIONAL PASS | M0–M4 internal alpha approved; public wedge, pilot, minor/privacy, and content-owner gates required |
| Autoplan Design | `/autoplan` | UI/UX and bilingual interaction | 2 voices | PASS WITH BLOCKERS | Design-system, IA, responsive, emotional-copy, and RTL contracts added |
| Autoplan Eng | `/autoplan` | Architecture, contracts, and operations | 1 complete voice + 1 timeout | PASS WITH BLOCKERS | M0 schema/state/job/provider/ops/test contracts required before feature code |
| Autoplan DX | `/autoplan` | Greenfield agent handoff | 2 voices | PASS WITH BLOCKERS | Bootstrap, `pnpm demo`, env/CI/docs/runbooks added as M0 gates |
| Eng Review | `/plan-eng-review` | Architecture and tests | 0 standalone | SUPERSEDED BY AUTOPLAN | Covered by the autoplan engineering phase; run standalone if implementation scope changes |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 standalone | SUPERSEDED BY AUTOPLAN | Covered text-only because design/browser binaries were unavailable |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 standalone | SUPERSEDED BY AUTOPLAN | Covered by the autoplan DX phase |

**VERDICT:** Autoplan completed with a conditional pass. The implementing agent may begin M0 discovery/bootstrap, but must not claim the full product is production-ready. M0 is the required next gate before feature code; M4/M5 is the first internal-alpha validation gate; public or paid release requires the explicit pilot and external-release gates above.

**UNRESOLVED DECISIONS:**
- Product wedge and launch market; pilot success thresholds are proposed above and require founder confirmation before public launch.
- Age/guardian posture, privacy/legal basis, data residency/provider transfer, retention, support, and trademark review.
- Named content owner, editorial QA sample, source freshness cadence, and release rollback authority.
- Current framework/provider/hosting versions and the final production cost/RPO/RTO envelope; the implementing agent owns the research record, but these are not silently treated as settled user decisions.
