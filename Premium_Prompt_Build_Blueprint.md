# Premium Prompt Build Blueprint

> Non-canonical earlier draft. Use [BUILD_BLUEPRINT.md](BUILD_BLUEPRINT.md) as the reviewed implementation handoff; it contains the final corrections, registries, milestones, and review report.

**Product:** Independent AI-native Multicheck preparation tutor  
**Requirements baseline:** Premium_Prompt.md  
**Review mode:** Hold scope  
**Audience:** The implementation agent that will take the repository from zero to production-capable release.

## 1. Decisions already made

| Decision | Direction | Consequence |
|---|---|---|
| Delivery | Staged modular monolith | Prove the learning loop before connectors or real providers. |
| Workspace | pnpm workspace now | Keep domain logic reusable without creating unused services. |
| Identity | Account from Milestone 1 | Evidence, schedules, credentials, and paired devices remain owned by a learner. |
| Content evidence | Versioned source and release lifecycle | Only reviewed sources can be described as official. |
| Tutor | One orchestrator and deterministic tools | Model output cannot mutate trusted state. |
| First provider | Deterministic mock | No key is needed before the core learning loop passes. |

## 2. Product frame and invariants

This is not a general AI chat app. It is an evidence-based system that helps a learner with possible mathematics and German gaps improve for an independent preparation goal.

~~~text
attempt -> rubric evaluation -> smallest useful feedback -> retry or prerequisite
        -> immutable learning evidence -> deterministic next review -> progress
~~~

The application must enforce these invariants:

1. The learner attempts each assessable item before an answer, target-answer translation, or full solution is disclosed.
2. One correct response never establishes mastery.
3. Hint use reduces evidence strength but is never treated as a judgment of the learner.
4. The model may recommend actions only. Trusted code validates and writes learning state, permissions, credentials, billing, ownership, and audits.
5. Questions are original, validated, labelled unofficial, and traceable to a released skill mapping.
6. Official facts appear only from released provenance records. Inferences are labelled.
7. A paid cloud provider never activates without explicit consent.
8. Attempts survive refresh, provider failure, and offline transitions without duplication.
9. iPhone Safari support, keyboard use, touch use, screen-reader basics, and mobile states are acceptance criteria, not polish.

Show this visible disclaimer before practice starts:

> This is an independent learning and preparation application. It is not affiliated with, endorsed by or operated by gateway.one. Practice questions are original simulations and are not official Multicheck® test questions.

## 3. Starting condition, scope, and dream-state delta

### What already exists

| Item | State | Required action |
|---|---|---|
| Premium_Prompt.md | Detailed requirements only | Preserve its learning, legal, provider, and acceptance-test constraints. |
| Application source | None | Start the workspace from zero. |
| Git and CI | None detected | Initialise before feature work and require actual CI results. |
| Curriculum records | None | Seed only reviewed, versioned mappings. |

### Not in scope before its named milestone

- Desktop connector, QR pairing, public relay, and iPhone-to-PC inference before Milestones 12-13.
- Hosted AI, real credentials, or paid fallback before the mock-provider vertical slice passes.
- Exact Multicheck timing/section claims without current, preserved primary-source evidence.
- Multi-agent tutoring, social features, payments, public APIs, classroom roles, gamified pressure, or opaque ML scheduling.
- Copying, reconstruction, scraping, or distribution of proprietary assessment questions.

### Dream-state delta

~~~text
NOW                                FIRST RELEASE                         12-MONTH IDEAL
Requirements document   ->         Trusted PWA tutor          ->          Full preparation system
no app                              diagnostic + review loop                curriculum breadth, simulations,
no learner evidence                 account-owned progress                  hosted/local models, secure pairing
no source lifecycle                 released curriculum evidence            evidence-backed outcomes
~~~

## 4. Foundation and repository setup

Before adding product features:

1. Initialise Git and a protected default branch.
2. Select supported current versions from official vendor documentation. Record each exact version, date, and reason in docs/decision-log.md.
3. Use current Node LTS, pnpm, strict TypeScript, a lockfile, reproducible installs, and environment validation.
4. Create development, test, staging, and production configuration. Unit, integration, and browser tests must not need real secrets.
5. Add CI for formatting, type checking, linting, unit/integration tests, browser smoke tests, production build, and dependency review.

### Workspace layout

~~~text
/
├─ apps/
│  └─ web/                         responsive server-rendered TypeScript PWA
├─ packages/
│  ├─ shared-schemas/              request, response, domain IDs, typed error schemas
│  ├─ learning-engine/             pure mastery, prerequisite, and scheduling logic
│  ├─ multicheck-curriculum/       domains, skills, dependencies, source releases
│  ├─ ai-gateway/                  provider contract and deterministic mock
│  ├─ tutor-orchestrator/          legal tool selection and fallback policy
│  ├─ content-grounding/           provenance and question validation pipeline
│  ├─ test-fixtures/               fixed clock, learners, questions, provider outcomes
│  └─ config/                      shared test/lint/compiler configuration
├─ docs/
│  ├─ product-requirements.md
│  ├─ learning-science.md
│  ├─ multicheck-research.md
│  ├─ curriculum-map.md
│  ├─ architecture.md
│  ├─ ai-provider-design.md
│  ├─ local-connector-design.md
│  ├─ threat-model.md
│  ├─ evaluation-plan.md
│  ├─ test-plan.md
│  └─ decision-log.md
├─ infra/
└─ CI workflow configuration
~~~

Create the desktop connector application only when Milestone 12 starts. Do not create an empty relay only to match the final architecture.

### Technology policies

- Use a React-based server-rendered application framework, PostgreSQL, a type-safe database layer with reviewed migrations, schema validation, a PWA solution compatible with the framework, and a mature auth implementation backed by PostgreSQL.
- Keep sessions in secure HTTP-only cookies. Never place session tokens or provider keys in local storage.
- Use deterministic unit/integration tests and Playwright browser tests. Mock every provider in CI.
- Use structured logs, trace IDs, and OpenTelemetry-compatible instrumentation.
- Prefer a modular monolith. Do not split operational services until the connector/relay milestones create a real boundary.

## 5. Architecture and ownership

~~~text
                                       +-----------------------------+
                                       | iPhone Safari / desktop PWA |
                                       | UI, accessibility, offline  |
                                       +-------------+---------------+
                                                     |
                                                     v
                                       +-----------------------------+
                                       | API boundary                |
                                       | auth, ownership, schemas    |
                                       +-------------+---------------+
                                                     |
             +---------------------------------------+---------------------------------------+
             |                                                                               |
             v                                                                               v
  +---------------------------+                                               +---------------------------+
  | Tutor orchestrator        |                                               | Curriculum/content        |
  | chooses legal next action |                                               | released mapping lookup   |
  +------------+--------------+                                               +------------+--------------+
               |                                                                               |
       +-------+-----------------------+                                           +-----------+-----------+
       |                               |                                           | PostgreSQL            |
       v                               v                                           | immutable evidence,   |
+---------------+             +-----------------+                                 | schedules, sources    |
| Learning      |             | AI gateway      |                                 +-----------------------+
| engine        |             | mock/hosted/    |
| trusted rules |             | connector later |
+---------------+             +-----------------+
~~~

| Component | Owns | Never owns |
|---|---|---|
| UI | Rendering, local drafts, accessible states | Mastery math, credentials, provider trust decisions |
| API boundary | Authentication, authorization, validation, idempotency | Hidden learning-policy rules |
| Tutor orchestrator | Calls approved deterministic tools and validates proposals | Direct database writes from model responses |
| Learning engine | Mastery, prerequisite routing, schedule selection | HTTP, UI, provider SDKs |
| AI gateway | Capabilities, generation, streaming, cancellation, provider error normalisation | Curriculum facts, learner ownership, permanent state |
| Content grounding | Sources, claims, mappings, question validation/release | Provider credentials or learner attempts |

Every user-owned record must have an account scope. Every query starts with the authenticated account ID. Do not fetch an arbitrary object ID and check ownership later.

## 6. Data model and trustworthy learning state

### Required tables

| Group | Tables | Critical constraints |
|---|---|---|
| Identity | User, LearnerProfile, LanguagePreference, TargetExam, TargetOccupation | Account scoped; verified identity; export/deletion path |
| Curriculum | CurriculumSource, CurriculumVersion, Domain, Skill, SkillDependency, LearningObjective | Stable IDs; source release state; no dependency cycle |
| Content | QuestionTemplate, GeneratedQuestion, Rubric, Activity | Versioned item/rubric; original/unofficial disclosure |
| Learning evidence | Attempt, AttemptAnswer, Feedback, HintUsage, ErrorClassification, MasteryState, ReviewSchedule, MistakeRecord | Attempts/hints append-only; derived state is versioned |
| Sessions/exams | LearningSession, SessionEvent, MockExam, MockExamSection, MockExamAttempt | State transition and timing policy recorded |
| Providers/devices | ProviderConfiguration, EncryptedCredential, ModelConfiguration, ConnectorDevice, PairedClient, UsageRecord | Secrets encrypted/redacted; pairing audit/revocation |
| Operations | AuditEvent | Security action, actor, time, correlation ID, no raw secret |

Generate attempt IDs on the server. Add a unique constraint on account ID plus client request ID, so an offline retry or double tap returns the original result rather than a second attempt.

### Attempt-first state machine

~~~text
activity_ready
  -> hint_shown(level 1-3) -> activity_ready
  -> answer_submitted -> evaluating -> feedback_ready
  -> feedback_ready -> retry_same -> activity_ready
  -> feedback_ready -> evidence_persisting -> scheduled_and_complete

Forbidden:
- activity_ready to full solution without a valid policy reason.
- evaluating twice for the same client request ID.
- scheduled_and_complete overwriting original evidence.
~~~

### Deterministic scheduler version 1

Implement this as a pure function with injected time. Store all inputs and the policy version.

1. Normalize rubric result to a score from zero to one.
2. Apply assistance multipliers: level 0 = 1.00, level 1 = 0.85, level 2 = 0.65, level 3 = 0.40, level 4 = 0.20.
3. Evidence quality equals rubric score multiplied by assistance multiplier. Apply response-time adjustment only to explicitly timed skills and never as an accessibility penalty.
4. Update a bounded, explainable mastery estimate from immutable evidence. Record the formula and configuration in docs/learning-science.md.
5. Do not call a skill established until it has two sessions, increasing review intervals, limited assistance, more than one format where relevant, and a transfer/application response.
6. Schedule incorrect/ungradable work for the same session when useful and within one day; heavily helped work within one day; level 2 within two days; level 1 within three days; unaided work at a three-to-seven-day interval; repeated due unaided success expands the interval; forgotten work shortens it and prioritises prerequisites.

### Daily activity order

~~~text
due review
  -> fragile prerequisite
  -> current objective
  -> interleaved/transfer activity only when prerequisites are stable
  -> reflection
  -> next review schedule
~~~

## 7. Tutor, provider, and question controls

### Tutor decision

The model may propose activity evaluation, rubric evidence, an error category, a hint level, feedback, and a next action. The server must independently verify:

- the activity belongs to the authenticated learner and is in a legal state;
- the rubric and skill exist in the released version;
- hint level and next action are legal for the current study/exam mode;
- feedback cannot disclose an answer early;
- model output cannot set mastery, schedule dates, ownership, credentials, permissions, billing, or audit fields.

On rejected or malformed output, retain the learner attempt, log a redacted typed error, apply deterministic feedback when possible, and show a clear retry state. Never fabricate a completed tutor turn.

### Provider contract

Support model discovery, connection test, generation, streaming, structured generation, capability reporting, cancellation, and cost metadata where available. Normalise errors into:

~~~text
ProviderTimeout | ProviderRateLimited | ProviderUnavailable |
ProviderUnauthorised | ProviderCancelled | ProviderMalformedOutput |
ProviderRefusal | ProviderContextLimit | ProviderCapabilityMismatch
~~~

Milestone 2 implements MockProvider only. Its fixtures must cover valid output, malformed JSON, empty output, refusal, timeout, interrupted stream, cancellation, and capability mismatch.

### Question release pipeline

~~~text
released skill + difficulty
  -> strict generation schema
  -> candidate question, answer, rubric
  -> deterministic validator
  -> independent verifier when needed
  -> ambiguity, duplicate, language, and policy check
  -> persisted validated version
  -> learner presentation

rejected candidate -> stored reason -> never learner-visible
~~~

- Maths questions must recalculate answers and units programmatically.
- Grammar accepts legitimate stored variants and avoids artificial ambiguity.
- Reading stores the supporting passage span for a correct answer.
- Every question retains generator model, prompt version, date, skill map, expected answer, rubric, validation record, source provenance, human-review status, and prior-display status.

## 8. Curriculum provenance, research, and legal boundary

### Release lifecycle

~~~text
discovered -> captured -> mapped -> reviewed -> released -> superseded/retired
~~~

Captured records hold organisation, title, canonical URL, access date, locator, claim, mapping rationale, status, reviewer, effective period, and learner disclosure. Mapping status is one of official-confirmed, official-general, or inferred.

Only released records may support learner-facing official wording. Inferred records may support original practice only when explicitly labelled. Curriculum updates create a new version and never rewrite old learner history.

Start with primary sources:

- gateway.one official Multicheck information and official demo links;
- official Zurich Lehrplan 21, especially German, maths, language, media/informatics, and transversal competencies;
- learning-science sources supporting retrieval, spacing, corrective feedback, prerequisite remediation, and interleaving.

Re-check official material immediately before enabling simulation parameters. Link to the official demo for interface familiarity, but do not extract proprietary questions or claim an independently inferred test structure is confirmed.

## 9. UX and accessibility contract

### Screen priority

1. Home: Continue today’s session, due reviews, target, weak prerequisite, model/privacy status, days remaining when known.
2. Learning: question, progress, relevant timer, answer input, submit, hint, do-not-understand, explain-differently, full-solution policy.
3. Feedback: concrete evidence, next action, retry/pre-requisite route.
4. Progress: readiness by domain, evidence-backed skill estimate, hint dependence, recurring errors, timed accuracy, trends.
5. Settings: language, provider, connection, cost, privacy, and fallback policy.

### State matrix

| Feature | Loading | Empty | Error | Partial/offline |
|---|---|---|---|---|
| Profile/onboarding | compact skeleton | unknown exam date is allowed | save retry | local draft persists |
| Diagnostic | item skeleton | no released item is a content error | safe fallback plus alert | current response queues |
| Learning activity | controls lock only on submit | no due work explains next goal | answer retained plus retry | pending-sync status |
| Provider settings | connection test status | no local model found | redacted recovery message | never cloud-fallback silently |
| Progress | aggregate skeleton | new learner explanation | cached read-only view | timestamped cached state |

### Mobile/accessibility rules

- Semantic forms/buttons, visible focus, labelled fields and errors, announced async state, contrast, reduced motion, text zoom, screen-reader support, keyboard navigation, and touch targets.
- Test narrow iPhone widths, safe areas, rotation, virtual keyboard, touch, desktop keyboard-only, and no-hover flow.
- Preserve typed answers across provider error, navigation, refresh, offline transition, and reconnect.

## 10. Error and rescue registry

| Codepath | Failure | Typed error | Rescue | Learner sees |
|---|---|---|---|---|
| Sign-in | expired callback | AuthCallbackError | end invalid session | Sign-in expired; try again |
| Profile save | retry/double submit | IdempotencyConflict | return original success | Normal saved state |
| Selection | no released activity | NoEligibleActivityError | safe fallback/alert | No suitable activity ready |
| Attempt | network loss | OfflineSubmissionError | queue and idempotent sync | Saved on device; syncing later |
| Attempt | stale/duplicate request | DuplicateAttemptError | return original result | Existing feedback |
| Evaluation | invalid rubric | RubricValidationError | ungradable safe path | Could not grade safely |
| Provider | timeout | ProviderTimeout | bounded retry/cancel | Answer saved; retry explanation |
| Provider | bad JSON | ProviderMalformedOutput | reject and use fallback | Explanation unavailable |
| Provider | refusal/empty | ProviderRefusal | preserve work/no deception | Explanation unavailable |
| Scheduler | transaction/lock | SchedulePersistenceError | rollback/retry idempotently | Answer saved; review sync retrying |
| Generation | ambiguous/duplicate | QuestionRejectedError | reject candidate | No invalid item displayed |
| Connector later | unpaired/revoked | ConnectorAuthorisationError | deny/re-pair | Device is not paired |

Unknown failures roll back safely, receive an incident ID, alert operations, and never expose raw credentials, tokens, provider prompts, or headers.

## 11. Security and privacy

| Threat | Control | Required proof |
|---|---|---|
| Keys/secrets leaked | server-only secrets, encrypted credentials, redaction | bundle, storage, and log tests |
| Cross-user data access | account-scoped queries and route guards | adversarial ID integration tests |
| XSS/unsafe Markdown | strict CSP and sanitised rendering | hostile corpus tests |
| CSRF/session abuse | secure same-site cookie/origin policy | browser mutation tests |
| Prompt injection | untrusted-data separation, allowlisted tools, output schema | injection fixture |
| Unsafe provider endpoint | block private/loopback/link-local from cloud, redirect/size/time limits | SSRF suite |
| Cost abuse | budgets, quotas, concurrency/input/output limits, cancellation | race and budget tests |
| Connector replay | one-time expiry, nonce, device credential, revocation | Milestones 12-13 tests |

Create docs/threat-model.md before handling credentials, custom provider URLs, or device pairing. Every sensitive action creates an audit event, and account data supports documented export and deletion.

## 12. Test, evaluation, observability, and rollout

### Tests

| Layer | Required coverage |
|---|---|
| Pure unit | scheduler, mastery, prerequisite routing, language and policy rules, validators |
| Database integration | migrations, ownership, idempotency, transactions, source release lifecycle |
| API integration | schemas, auth, provider fallback, budget, cancellation |
| Browser E2E | onboarding, diagnostic, attempt-feedback-retry-schedule, mobile, offline queue |
| Security | XSS, CSRF, object access, redaction, SSRF, prompt injection, rate limits |
| Evaluation | correct, partial, wrong method, arithmetic slip, grammar variants, bilingual hidden-answer, malformed model output |

The hostile QA suite must include duplicate submission, stale state, missing prerequisites, overconfidence, unsupported tutor claim, ambiguous item, interrupted stream, no network, reconnect, refresh, local model with no tool calling, and iPhone keyboard behavior.

### Observability

Log redacted structured events for session flow, activity selection, attempts, hints, evaluation, scheduling, content rejection, provider latency/outcome/cancellation, offline queue, credentials, pairing, revocation, and incident IDs.

Dashboards answer: Are attempt-retry loops completing? Are due reviews scheduled/completed? Are provider failures/costs rising? Are validators rejecting unusual shares? Is offline sync losing or duplicating work?

### Rollout and rollback

~~~text
backward-compatible migration
  -> deploy code compatible with old/new schema
  -> internal feature flag
  -> smoke test sign-in, attempt, schedule, mock provider, iPhone route
  -> observe errors/cost/queue
  -> expand rollout

rollback: disable flag -> deploy prior compatible code -> preserve immutable evidence
          -> repair/replay only idempotent schedule work
~~~

Each migration documents lock/index risk, compatibility window, rollback, and repair. Test on staging before production.

## 13. Milestones and exit gates

| Milestone | Build | Gate to proceed |
|---|---|---|
| 0 Foundation/research | Workspace, CI, documents, primary-source research, source lifecycle, threat/evaluation/test plans | Clean clone verifies without credentials; no unverified public claims |
| 1 App shell | Account auth, profile/preferences, PWA, navigation, settings, responsive/accessibility shell | Sign-in, save/reload, install, desktop/iPhone smoke pass; no local-storage secret |
| 2 Mock provider | Gateway contract, deterministic streaming/structured/failure fixtures | Every provider rescue path is deterministically tested |
| 3 Curriculum graph | EBA/WA domains, shared prerequisites, maths/German/logic seeds, versions/releases | Idempotent seed; no cycles/orphans; provenance tests |
| 4 Core vertical slice | Select target, diagnostic item, attempt, feedback, retry, evidence, schedule, progress | Attempt-first/idempotency/hint/mastery/provider/mobile tests pass |
| 5 Adaptive diagnostic | Bounded multi-domain branching, confidence, prerequisite route, initial plan | Weak learner reaches useful prerequisite; all branches tested |
| 6 Maths course | Arithmetic through data/application modules and programmatic validators | Answers/units independently verified; prerequisite/transfer coverage |
| 7 German course | Reading, vocabulary, grammar, spelling, writing, Persian explanations | Valid variants accepted; no target answer leaks |
| 8 Cognitive modules | Logic, concentration, delayed memory, coordinate/comparison metrics | Delay is real; speed does not reward random clicks |
| 9 EBA preparation | Practical basic knowledge, EBA plan/practice/simulation/error analysis | Inferred claims labelled; simulation source/version visible |
| 10 WA preparation | Languages, digital, organisation, networked thinking, situational judgement | Calendar works mouse/keyboard/touch; no personality claims |
| 11 Hosted providers | Hosted adapter, encrypted/session credentials, budget, cancellation, consent | Redaction/deletion/invalid credential/no-fallback tests pass |
| 12 Desktop connector | Loopback-only local detection, models, streaming, pause/revoke | Not publicly exposed; unavailable/cancel/context tests pass |
| 13 iPhone-PC inference | QR pairing, outbound relay, device credential, replay/revocation/offline | iPhone never uses own localhost; pairing/replay/revoke E2E pass |
| 14 Full exams | Configurable sections/timers, no-hint mode, original pool, analysis/readiness | No early feedback leak; source version/date retained |
| 15 Hardening | Permission/credential audit, recovery, backups, export/delete, Safari/accessibility/deploy review | Actual CI/build/migration/recovery/mobile evidence recorded |

## 14. Agent execution loop

For every slice:

1. Read relevant docs and inspect the actual tree.
2. Run all existing verification commands and record baseline truth.
3. Declare user outcome, scope, non-goals, modules, data change, security/accessibility/learning constraints, and tests.
4. Implement the smallest complete path including loading, empty, error, cancellation, and offline states.
5. Add fixtures before claiming success.
6. Run formatter, type check, lint, unit/integration/E2E/security tests, production build, dependency check, and relevant mobile tests.
7. Review for answer leakage, improper state mutation, secrets, provider coupling, cross-user access, duplicate evidence, and provenance drift.
8. Repair attributable failures. Never delete tests or weaken assertions for green status.
9. Update all affected docs, migrations, decision records, threat/test plans, and runbooks.
10. Report milestone, slice, changed files, commands/results, security/learning/mobile review, limitations, and next slice.

Ask the owner only for missing unmockable credentials, irreversible production/financial action, legal conflict, or a product-defining decision with no safe default. Otherwise make the smallest defensible choice, record it, test it, and continue.

## 15. Build-actionable task order

- [ ] **T1 P1, human 4h / agent 25m** — create workspace, CI, strict TypeScript, local/test database, and reproducible commands.
- [ ] **T2 P1, human 5h / agent 35m** — create all required product, research, architecture, threat, evaluation, test, and decision documents.
- [ ] **T3 P1, human 6h / agent 45m** — implement account-scoped migrations, immutable evidence, idempotency, source release records, and indexes.
- [ ] **T4 P1, human 5h / agent 35m** — implement pure mastery, prerequisite, and scheduler functions with injected time and exhaustive tests.
- [ ] **T5 P1, human 5h / agent 40m** — implement mock provider, typed errors, structured validation, streaming/cancellation fixtures.
- [ ] **T6 P1, human 8h / agent 60m** — implement the select-attempt-evaluate-feedback-retry-schedule-progress vertical slice.
- [ ] **T7 P1, human 5h / agent 40m** — implement auth, ownership, input/Markdown/CSP policy, secret redaction, and security tests.
- [ ] **T8 P1, human 4h / agent 30m** — implement PWA shell, offline attempt queue, iPhone keyboard behavior, and accessibility smoke tests.
- [ ] **T9 P2, human 6h / agent 45m** — implement content release, curriculum validators, question pipeline, and duplicate protection.
- [ ] **T10 P2, human 4h / agent 30m** — add observability, rollout flags, migration/runbook templates, and staged smoke checks.
- [ ] **T11 P2, human 6h / agent 45m** — implement adaptive diagnostic only after the core loop is stable.
- [ ] **T12 P3, human 2-3 days / agent 3h** — begin connector work only after Milestones 1-11 meet their gates.

## 16. Review conclusion

The first successful release is a learner completing a trustworthy attempt-feedback-retry-review loop, not a fluent chat demo or a local-model connector. Build breadth only after that loop is measurable, source-grounded, secure, mobile-safe, and fully tested.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---|---|---|
| CEO Review | plan-ceo-review | Scope and sequencing | 1 | HOLD SCOPE | Staged workspace, account-first ownership, provenance release gate accepted |
| Independent review | Document adversarial pass | Completeness, clarity, feasibility | pending | pending | To be recorded after draft review |
| Engineering review | plan-eng-review | Architecture and tests | 0 | not run | Required before implementation starts |
| Design review | plan-design-review | UX and accessibility | 0 | not run | Recommended before learner-facing implementation |

**VERDICT:** The CEO delivery contract is ready. Run an engineering plan review before implementation.
NO UNRESOLVED DECISIONS
