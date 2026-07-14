# Mobile technical architecture

## 1. Goals

The Expo application must make essential care tracking fast, work offline, and show reviewed stage tips without coupling the product to grapes or future AI.

Feature ownership, small public interfaces, content provenance, runtime validation, and deterministic verification are core constraints.

## 2. Architectural decisions

### Feature-first organization

**Context:** Layer-first folders scatter one feature across the repository.

**Decision:** Organize by `plants`, `guidance`, `journal`, `reminders`, `weather`, `knowledge`, `today`, `auth`, and `settings`; separate model, application, data, and UI inside each feature.

**Rationale:** Related knowledge and changes stay local.

**Consequences:** Feature ownership is clear. Cross-feature access must use public interfaces instead of internal imports.

### Local-first persistence

**Context:** Garden connectivity may be unreliable, but entry must feel immediate.

**Decision:** Use Expo SQLite as the application read/write source. Synchronize with Supabase through an outbox.

**Rationale:** A saved entry must not depend on network availability.

**Consequences:** The app needs migrations, conflict policy, sync observability, and recovery tests. TanStack Query remains a projection cache, not the database.

### Thin Expo Router routes

**Decision:** Route files handle URLs, params, layouts, and redirects. Feature screens own presentation; application modules own behavior.

**Consequences:** Routes never call Supabase, validate forms, or implement business rules.

### Supabase behind feature seams

**Decision:** UI and application modules never import the Supabase client. Infrastructure adapters translate remote rows into feature-owned models.

**Consequences:** Technology details remain local, but unnecessary pass-through repositories are forbidden.

### Runtime validation

**Decision:** Zod validates every untrusted boundary: environment, route params, deep links, notifications, Supabase responses, and Edge Function payloads.

### Deterministic care suggestions for MVP

**Context:** Care recommendations can affect plant health, while MVP content and behavioral evidence are limited.

**Decision:** Derive optional care suggestions locally from versioned stage playbooks, recent activity, and a small set of typed weather rules. Suggestions are ephemeral and AI does not produce MVP guidance.

**Rationale:** Reviewed deterministic rules are explainable, testable, offline-ready, and easier to correct.

**Consequences:** Content review becomes a release gate. The rule set stays narrow, but its interface can later accept an AI-backed adapter.

### Explicit activity saving

**Context:** Tips, suggestions, and reminders must not claim that care happened.

**Decision:** History is created only when the user explicitly saves a Care Entry. A Today prompt or reminder may prefill that form but cannot create history itself.

**Rationale:** The journal remains trustworthy while prefilled entry keeps suggested care fast.

**Consequences:** Activity saves must be idempotent and may retain an origin label such as suggestion, reminder, or manual entry.

## 3. Target folder structure

```text
/
├── app/                         # Thin Expo Router routes and layouts
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (onboarding)/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Four destination tabs
│   │   ├── today.tsx
│   │   ├── plants.tsx
│   │   ├── journal.tsx
│   │   └── me.tsx
│   ├── plants/
│   │   └── [id]/
│   │       ├── index.tsx    # Plant Detail
│   │       ├── care.tsx     # Care Entry
│   │       ├── water.tsx
│   │       └── guide.tsx    # Stage Playbook — accepts optional stageId query param
│   ├── entries/
│   ├── reminders/
│   ├── settings/
│   └── data-management/
├── src/
│   ├── bootstrap/               # Composition root, providers, app boot
│   ├── features/
│   │   ├── plants/
│   │   │   ├── model/
│   │   │   ├── application/
│   │   │   ├── data/
│   │   │   ├── ui/
│   │   │   ├── testing/
│   │   │   ├── README.md
│   │   │   └── index.ts
│   │   ├── journal/
│   │   ├── guidance/
│   │   ├── reminders/
│   │   ├── weather/
│   │   ├── knowledge/
│   │   ├── today/
│   │   ├── me/
│   │   ├── auth/
│   │   └── settings/
│   ├── sync/                    # Outbox, push/pull, checkpoints, conflicts
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── supabase/
│   │   ├── storage/
│   │   ├── notifications/
│   │   ├── secure-storage/
│   │   ├── connectivity/
│   │   └── logging/
│   ├── shared/
│   │   ├── ui/
│   │   ├── errors/
│   │   ├── validation/
│   │   ├── types/
│   │   └── testing/
│   └── config/
├── assets/
├── knowledge/                    # Curated, versioned, non-user content
│   ├── schemas/
│   ├── species/
│   ├── diseases/
│   ├── pests/
│   ├── fertilizers/
│   ├── care-guides/
│   ├── seasonal-tips/
│   └── weather-rules/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── tests/
│   └── seed.sql
├── tests/e2e/
├── docs/
├── scripts/
├── app.config.ts
└── eas.json
```

Create directories only when they support real behavior. Empty scaffolding is forbidden.

## 4. Layer responsibilities

| Layer          | Owns                                                     | Must not own                            |
| -------------- | -------------------------------------------------------- | --------------------------------------- |
| Route          | URL, params, layout, navigation                          | Business logic, queries, Supabase calls |
| UI             | Rendering, interaction, accessibility, form presentation | SQL, sync policy, remote access         |
| Application    | Use cases, orchestration, query options, invalidation    | JSX, navigation, vendor details         |
| Model          | Domain terms, invariants, schemas, transitions           | I/O, React, framework state             |
| Data           | Feature persistence interface and adapters               | UI state, cross-feature workflow        |
| Sync           | Outbox, push/pull, retry, checkpoint, conflict           | Presentation and navigation             |
| Infrastructure | SQLite, Supabase, files, notifications, logging          | Feature-specific rules                  |
| Shared UI      | Stable design primitives                                 | Domain components                       |
| Bootstrap      | Dependency creation and lifecycle                        | Product use cases                       |

Dependencies point inward: model → nothing; application → model/interfaces; adapters → owned interfaces; UI → feature public interface. Shared code imports no feature. Enforce this in lint/CI.

## 5. Feature interfaces and ownership

Each feature is a deep module with one public `index.ts`. Export only screens, public use cases, required IDs/events, query composition, and intentional test builders.

- `plants`: plant identity, species, metadata, active/archive state, current growth stage, and stage history.
- `guidance`: reviewed stage tips and deterministic, ephemeral care suggestions with explanations and optional Care Entry prefills.
- `journal`: core care records, photo-and-note plant updates, photos, and timeline.
- `reminders`: due, completed, and snoozed care reminders.
- `weather`: current conditions, freshness, location precision, and care-context summary.
- `knowledge`: read-only species, stage playbooks, tips, care recommendations, health, fertilizer, seasonal, and weather-rule content.
- `today`: derived guidance/weather/reminder/journal read model; owns no source data.
- `me`: composition for preferences, data tools, support, and future account capabilities; owns no business records.
- `auth`: guest identity, session, account upgrade, sign-out.
- `sync`: mutation envelopes, checkpoints, and sync status.

Features never import another feature's internals or database tables.

The Guidance module exposes a small capability surface: read reviewed stage tips, derive separately reviewed care suggestions, and build a validated Care Entry prefill. A user confirms a stage change only while saving a journal entry.

Playbook parsing and presentation remain internal to the module. Care-suggestion applicability, weather adjustment, prioritization, explanation, and deduplication require their own reviewed contracts; this change does not add a rule engine.

### Navigation composition

The `(tabs)` layout owns four destination tabs. Route files remain thin and import public screens from `today`, `plants`, `journal`, and `me`.

Today and Plant Detail open public care-entry and new-journal-entry routes with validated plant and activity parameters.

Reminder Management is a secondary route reachable from Today, Plant Detail, and Me. These entry points share one screen and preserve a single reminder behavior.

There is no global action overlay. Today derives relevant core-care prompts; Plant Detail supplies the current plant context directly.

### User data and Knowledge Base separation

User data includes plants, current stage selection, core care activities, plant journal updates, photos, timeline, and reminders. It is private, mutable, synchronized, and protected by Supabase RLS.

Knowledge Base data includes plant species, valid growth stages, diseases, pests, fertilizers, care guides, and seasonal tips. It is curated, read-only in the app, versioned, and never mixed into user-owned tables.

User records reference stable knowledge IDs such as `speciesId`, `growthStageId`, or optional catalog IDs. A label change in knowledge must not rewrite journal history.

Stage playbooks are review-stage guidance contracts, not user data. Each playbook defines concise stage context: objective, entry and exit observations, estimated duration, knowledge topics, and sources. They do not define reminders, tasks, automatic transitions, or executable agronomic rules.

### Structured user-data model

A plant stores `speciesId`, `currentGrowthStageId`, and a nullable `stageStartedAt` time. A confirmed change inside New Journal Entry creates stage history linked to that journal entry and atomically updates both the current stage and `stageStartedAt` from the update occurrence time. Migration may backfill the value from the newest history row whose target is still current; plants without that evidence remain null. Entry and exit observations guide user review only; they are not persisted progress or automatic transition criteria.

Every species definition contains at least one stage. The generic `other` species provides a stable `unspecified` stage, displayed as “Chưa xác định”.

This keeps the database invariant valid without inventing a plant-specific stage.

A care activity stores plant, one of `watering`, `fertilizing`, or `spraying`, occurrence time, notes, photos, origin, and sync metadata. Optional type-specific detail uses validated one-to-one records, not an unbounded key/value model.

A plant update stores plant, occurrence time, optional note, photos, confirmed stage ID, and sync metadata. Pruning and observations may be described in the note but do not introduce dedicated activity types.

Compact plant-identity read models derive each plant's image from the first photo of its newest photo-bearing Plant Update. Screens receive this derived URI through their query projection; `Plant` stores no duplicate current-photo pointer. A historical Plant Update row may instead use its own first photo as event content. A missing or unreadable local URI is a presentation fallback, not a data mutation.

If the selected stage differs from the plant's current stage, one transaction saves the journal entry, updates the plant, creates stage history, and adds the required outbox items.

If the stage is unchanged, the save creates no redundant stage-history row. Retry uses one mutation ID so the journal entry and optional stage transition remain idempotent.

Care suggestions are derived read models, not stored task instances. A suggestion contains its knowledge definition ID and version, plant, proposed activity, reason, priority, optional weather adjustment, and validated Care Entry prefill.

Opening, dismissing, or ignoring a suggestion creates no user record. Saving its Care Entry creates one care record and outbox item in a local transaction.

The care record may store `origin = today`, `reminder`, or `manual`, plus an optional recommendation ID and version for explanation and analytics.

The save command uses a client-generated mutation ID so retries cannot duplicate history.

Fertilizing detail stores product name, fertilizer type, NPK ratio, amount with unit, and application method. Spraying detail stores product name, purpose, dosage with unit, and notes.

Do not use free-form units when a structured value is available. Preserve the original user-entered value for display while storing a normalized value when conversion is safe.

### MVP Knowledge Base structure

The complete domain model, authoring contract, rule format, migration path, and RAG strategy live in [KNOWLEDGE_BASE_ARCHITECTURE.md](./KNOWLEDGE_BASE_ARCHITECTURE.md).

```text
knowledge/
├── schemas/
│   ├── frontmatter.schema.json
│   └── content-types.md
├── species/
│   └── grape/
│       ├── species.md
│       ├── growth-stages/
│       │   ├── seedling.md
│       │   ├── trunk-development.md
│       │   └── flowering.md
│       ├── care-recommendations/
│       └── care-guides/
├── diseases/
├── pests/
├── fertilizers/
├── care-guides/
├── seasonal-tips/
└── weather-rules/
```

Each Markdown file has stable ID, content type, locale, species scope, version, review date, and source metadata in frontmatter. CI validates frontmatter, links, uniqueness, and allowed stage ordering.

Each growth-stage file includes name, goal, description, watering, fertilizers, activities, avoid list, common diseases/pests, completion criteria, and next-stage ID.

Recommended fertilizers, watering, diseases, pests, and guides are referenced by stable knowledge IDs rather than copied into every playbook.

Care Plans combine one allowed core activity type with stage-scoped presentation content, applicability, a deliberately small eligibility policy, and a safe Care Entry prefill policy. Generic Care Guides remain informational and are not required by Care Plans.

MVP recommendation activity types are limited to `watering`, `fertilizing`, and `spraying`. Pruning or observation knowledge may become a stage tip or guide, never a generated care-entry type.

Weather rules contain typed conditions and one allowed effect: prioritize, delay, suppress, or annotate. Every effect includes a Vietnamese explanation and source metadata.

Markdown is preferred for MVP because it is low-cost, human-readable, diffable, reviewable, versioned with code, easy to bundle for offline use, and sufficient for a small editorial team.

A database would add authoring UI, migration, permissions, hosting, and synchronization before content volume or editorial workflow justifies them.

### Knowledge evolution

The application reads knowledge only through a small `KnowledgeRepository` interface. The initial adapter loads validated Markdown indexes generated at build time.

Later adapters can use PostgreSQL for structured querying, a CMS for editorial workflows, or a vector database for semantic retrieval. The product/application interface remains stable.

For AI RAG, a publishing pipeline can chunk approved Markdown or CMS content, attach source/version metadata, and write embeddings to a vector store. The mobile app still requests knowledge through the same application capability.

## 6. Naming conventions

- Files/folders: `kebab-case`.
- Components, types, classes, schemas: `PascalCase`.
- Functions, hooks, variables: `camelCase`.
- Constants: `SCREAMING_SNAKE_CASE` only for true constants.
- Screens: `PlantDetailScreen`; UI: `PlantCard`.
- Use cases: verb + object, such as `recordWatering`.
- Repositories: `PlantRepository`; no `I` prefix.
- Adapters: technology + role, such as `SqlitePlantRepository`.
- Zod values: `PlantSchema`; query factories: `plantKeys`.
- Database: plural `snake_case` tables and `_id` foreign keys.
- Events/logs: `domain.object.action`.
- Use `plant` as the generic model; `grape` is a plant type.

## 7. Coding standards

Follow [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md). Architecture-specific rules:

- Strict TypeScript; never use `any`.
- Keep persistence rows, remote rows, and domain models distinct.
- Keep components below 200 lines and prefer composition.
- Do not fetch in `useEffect`; use application-owned TanStack Query options.
- Do not store derivable state.
- Validate and normalize form input before application use cases.
- Use only feature `index.ts` for cross-feature imports.
- Do not create broad `utils.ts`, `helpers.ts`, or repository-wide barrels.
- Each feature README documents purpose, interface, owned data, invariants, dependencies, failures, and test commands.

## 8. State management

| State                       | Owner                                                    |
| --------------------------- | -------------------------------------------------------- |
| Durable business data       | SQLite feature repositories                              |
| Curated plant knowledge     | Read-only Knowledge Repository                           |
| Current/stale weather       | Weather repository + SQLite cache                        |
| Derived care suggestions    | Guidance application module; no durable suggestion state |
| Async lifecycle/projections | TanStack Query                                           |
| Form drafts/validation      | React Hook Form + Zod                                    |
| Auth state machine          | Auth module                                              |
| Navigation                  | Expo Router                                              |
| Local UI state              | Nearby component/reducer                                 |
| Theme, locale, dependencies | Narrow root providers                                    |
| Sync status                 | Sync module                                              |

Do not add Redux or Zustand unless a documented state need cannot fit these owners.

TanStack Query reads local repositories. Mutations run application use cases, commit SQLite and outbox atomically, then invalidate owned query keys.

## 9. Networking

- Create one Supabase client in bootstrap and store sessions securely.
- Parse remote payloads with Zod.
- Enforce RLS on every user-owned table; never ship a service-role key.
- Use RPC for atomic multi-table operations and Edge Functions for privileged/secret work.
- Store images in private Supabase Storage buckets.
- Fetch weather through a provider adapter or Edge Function so provider keys and normalization stay outside the client.
- Request only current conditions, rain chance, humidity, and near-term rain forecast for MVP.
- Add Realtime only when collaboration proves it necessary.
- Use finite timeouts, exponential backoff with jitter, and idempotent mutation IDs.
- Do not retry validation, permission, not-found, or conflict errors indefinitely.
- Attach correlation IDs without logging personal data or credentials.

Weather responses include observation time, forecast window, location precision, and provider attribution. They become normalized input to the local Guidance module.

### Deterministic Care Suggestion Evaluator

The Guidance module reads plant stage, validated playbook, recent relevant history, due reminders, and fresh-enough weather through read-only interfaces.

It returns a small ordered list containing suggestion ID, activity type, reason, optional preparation content, source version, Care Entry prefill, and any weather adjustment.

MVP uses typed evaluators rather than a general rules language. Rules are reviewed in Git and limited to known cases such as rain, heavy rain, heat, watering, spraying, and soil-moisture checks.

Suggestion identity is deterministic for plant + local date + Care Plan + playbook version. Reopening Today does not duplicate visible suggestions or write user data.

If weather is missing or stale, the engine returns safe base guidance and marks it unadjusted. A weather failure never invents a recommendation.

## 10. Offline synchronization

1. Validate the command and domain invariants.
2. Write the local row and outbox envelope in one transaction.
3. Invalidate local projections and update UI immediately.
4. Push when network and auth are available.
5. Server applies the mutation idempotently and advances `version`.
6. Merge the canonical row locally and complete the outbox item.

Client-generated UUIDs support offline creation. Synchronized rows carry `version`, `updated_at`, `deleted_at`, and ownership metadata.

Updates send `base_version`. On conflict, preserve local pending data and the remote canonical row; never overwrite silently. Deletes use tombstones before eventual hard deletion.

Photos save a local URI first, upload independently with checksum and retry, and never roll back the journal entry when upload fails.

An explicit activity save syncs as one logical mutation. Remote retries use its mutation ID and preserve the optional suggestion or reminder origin.

## 11. Caching

- TanStack Query cache is reconstructable from SQLite and is not durable user storage.
- Local queries use long/infinite stale time and explicit invalidation.
- Apply bounded garbage collection to large timelines.
- Index SQLite for timeline, reminders, and outbox access patterns.
- Cache weather by coarse location and forecast window with an explicit freshness timestamp.
- Bundle the validated grape Knowledge Base for offline access; invalidate it by content version.
- Use cursor pagination for long timelines.
- Cache image thumbnails on the filesystem with size-bounded LRU eviction.
- Key image cache by asset ID and version, not temporary signed URL.

## 12. Authentication flow

Auth states are `booting`, `guest`, `authenticating`, `authenticated`, `refreshing`, `signedOut`, and `error`.

Startup order: migrate SQLite, restore local identity/session, render local data, then start sync when a valid session exists. Network refresh failure keeps local mode; revoked credentials stop sync but never silently delete local data.

Guest users can create local data. Account upgrade uploads guest data in resumable idempotent batches under `auth.uid`. Existing remote and guest data are merged by UUID without automatic deletion.

MVP favors email OTP/magic links. Expo Router receives and validates auth deep links. Sign-out clears secrets and sensitive caches while handling local data through an explicit user choice.

## 13. Error handling

Normalize vendor errors into:

- `ValidationError`
- `AuthenticationError`
- `AuthorizationError`
- `NotFoundError`
- `ConflictError`
- `OfflineError`
- `RateLimitError`
- `InfrastructureError`
- `UnexpectedError`

Field errors render near inputs. Recoverable action errors preserve user data. Background sync errors are non-blocking. Route/root error boundaries handle render failures. UI never parses Supabase messages or exposes stack traces.

Expected domain failures return structured results. Query/mutation I/O may throw normalized application errors for TanStack Query.

## 14. Logging and observability

Use structured events with timestamp, level, event name, app/build version, platform, environment, correlation ID, and allowlisted metadata.

Never log tokens, OTPs, full email, user notes, plant names, signed URLs, or images. Pseudonymize user identifiers and sanitize centrally.

Track crash-free sessions, startup, migrations, sync latency/backlog, upload failures, and auth refresh failures. Analytics and diagnostic logs remain separate.

## 15. Testing strategy

| Level           | Scope                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| Model           | Pure rules, schemas, transitions, dates, units                                       |
| Feature         | Public interface with isolated SQLite                                                |
| UI              | Rendering, interaction, states, accessibility                                        |
| Supabase        | Migrations, RPC, Storage, RLS                                                        |
| Knowledge       | Schema validation, stable IDs, links, ordering, localization                         |
| Weather         | Normalization, freshness, stale fallback, provider errors                            |
| Guidance        | Stage tips, suggestion derivation, reasons, deduplication, weather effects, prefills |
| Activity saving | Validation, idempotency, origin attribution, optional detail updates                 |
| Sync            | Offline, retry, idempotency, conflicts, restart                                      |
| E2E             | P0 flows with Maestro on iOS and Android                                             |

Use real local/test infrastructure by default. Do not add mock/fake implementations unless requested.

Required offline scenarios include restart before sync, network loss mid-push/upload, duplicate delivery, expired auth, migration with pending outbox, remote version conflict, timezone changes, and storage exhaustion.

Guidance tests cover stale weather, playbook updates, duplicate visible suggestions, stage changes, safe prefills, and the absence of writes before Save. Activity tests cover save retries and journal-entry uniqueness.

CI runs typecheck, lint, tests, architecture checks, Supabase tests, Expo preview compile, and P0 E2E smoke flows.

## 16. Production readiness

- Separate development, preview, and production EAS profiles and Supabase projects.
- Use backward-compatible expand-migrate-contract database changes.
- Release OTA updates only when native runtime and schema remain compatible.
- Support staged rollout, crash monitoring, rollback, export, deletion, and tested restore.
- Measure cold start, navigation, query latency, dropped frames, and memory on mid-range Android.
- Never block first meaningful render on remote I/O.

## 17. AI product readiness

The architecture prepares data for a future gardening assistant without implementing the assistant now.

An AI context builder can combine four explicit inputs:

- **User history:** recent core care activities, plant updates, photo metadata, and reminders through feature read interfaces.
- **Plant stage:** the current confirmed stage ID plus species-specific stage knowledge.
- **Weather:** timestamped current conditions and rain context with freshness metadata.
- **Knowledge Base:** approved passages with stable IDs, locale, sources, review dates, and versions.
- **Deterministic suggestions:** proposed activities, reasons, rule versions, and whether users later saved related care.

The future AI module must depend on read-only application interfaces, never query feature tables directly. This preserves feature ownership and allows Markdown, PostgreSQL, CMS, or vector adapters to change independently.

Recommendations must carry evidence references, input timestamps, knowledge versions, confidence/limitations, and a clear distinction between observed facts and generated suggestions.

Future photo analysis may propose a stage candidate with confidence and model version. It cannot update `currentGrowthStageId`; only a user-confirmed journal save may do that.

User data requires explicit consent and least-privilege retrieval. Sensitive notes, photos, and location must not be sent to an AI provider by default.

Structured stages, suggestions, reasons, saved activities, stable IDs, timestamps, units, and weather freshness make later personalization possible without redesigning guidance or history.

## 18. AI-friendly development

- One feature directory, one public interface, one feature README.
- Thin routes and enforced dependency rules make change locations predictable.
- Invariants and failure modes live beside the public interface.
- Tests describe behavior at the seam and survive internal refactors.
- PRs stay small and feature-focused.
- Stable commands expose typecheck, lint, test, E2E, and database verification.

## 19. Implementation order

1. Bootstrap Expo Router, strict TypeScript, providers, and minimal UI primitives.
2. Add SQLite migrations, transactions, and boot state.
3. Add the validated Markdown Knowledge Repository and one complete grape stage playbook.
4. Build plants with species-defined stages and user-confirmed stage transitions.
5. Build contextual care entry and trustworthy activity history.
6. Add reviewed stage tips to Plant Detail.
7. Build deterministic care suggestions that prefill Care Entry without writing history.
8. Add weather normalization and reviewed weather-rule adjustments.
9. Add photo-and-note plant updates with optional stage transition, Journal, and reminders.
10. Create Supabase schema, RLS, and generated types locally.
11. Add outbox and sync; verify offline completion/restart before production connectivity.
12. Add guest-to-account auth, observability, E2E, and release gates.
