# Mobile technical architecture

## 1. Goals

The Expo application must remain maintainable, offline-ready, production-ready, and extensible beyond grapes. Feature ownership, small public interfaces, runtime validation, and deterministic verification are core constraints.

## 2. Architectural decisions

### Feature-first organization

**Context:** Layer-first folders scatter one feature across the repository.

**Decision:** Organize by `plants`, `journal`, `reminders`, `today`, `auth`, and `settings`; separate model, application, data, and UI inside each feature.

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

## 3. Target folder structure

```text
/
├── app/                         # Thin Expo Router routes and layouts
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (onboarding)/
│   ├── (tabs)/
│   ├── plants/
│   ├── entries/
│   ├── reminders/
│   └── settings.tsx
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
│   │   ├── reminders/
│   │   ├── today/
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

| Layer | Owns | Must not own |
| --- | --- | --- |
| Route | URL, params, layout, navigation | Business logic, queries, Supabase calls |
| UI | Rendering, interaction, accessibility, form presentation | SQL, sync policy, remote access |
| Application | Use cases, orchestration, query options, invalidation | JSX, navigation, vendor details |
| Model | Domain terms, invariants, schemas, transitions | I/O, React, framework state |
| Data | Feature persistence interface and adapters | UI state, cross-feature workflow |
| Sync | Outbox, push/pull, retry, checkpoint, conflict | Presentation and navigation |
| Infrastructure | SQLite, Supabase, files, notifications, logging | Feature-specific rules |
| Shared UI | Stable design primitives | Domain components |
| Bootstrap | Dependency creation and lifecycle | Product use cases |

Dependencies point inward: model → nothing; application → model/interfaces; adapters → owned interfaces; UI → feature public interface. Shared code imports no feature. Enforce this in lint/CI.

## 5. Feature interfaces and ownership

Each feature is a deep module with one public `index.ts`. Export only screens, public use cases, required IDs/events, query composition, and intentional test builders.

- `plants`: plant identity, type, metadata, active/archive state.
- `journal`: entries, care types, observations, photos, timeline.
- `reminders`: due, completed, and snoozed care reminders.
- `today`: derived cross-feature read model; owns no source data.
- `auth`: guest identity, session, account upgrade, sign-out.
- `sync`: mutation envelopes, checkpoints, and sync status.

Features never import another feature's internals or database tables.

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

| State | Owner |
| --- | --- |
| Durable business data | SQLite feature repositories |
| Async lifecycle/projections | TanStack Query |
| Form drafts/validation | React Hook Form + Zod |
| Auth state machine | Auth module |
| Navigation | Expo Router |
| Local UI state | Nearby component/reducer |
| Theme, locale, dependencies | Narrow root providers |
| Sync status | Sync module |

Do not add Redux or Zustand unless a documented state need cannot fit these owners.

TanStack Query reads local repositories. Mutations run application use cases, commit SQLite and outbox atomically, then invalidate owned query keys.

## 9. Networking

- Create one Supabase client in bootstrap and store sessions securely.
- Parse remote payloads with Zod.
- Enforce RLS on every user-owned table; never ship a service-role key.
- Use RPC for atomic multi-table operations and Edge Functions for privileged/secret work.
- Store images in private Supabase Storage buckets.
- Add Realtime only when collaboration proves it necessary.
- Use finite timeouts, exponential backoff with jitter, and idempotent mutation IDs.
- Do not retry validation, permission, not-found, or conflict errors indefinitely.
- Attach correlation IDs without logging personal data or credentials.

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

## 11. Caching

- TanStack Query cache is reconstructable from SQLite and is not durable user storage.
- Local queries use long/infinite stale time and explicit invalidation.
- Apply bounded garbage collection to large timelines.
- Index SQLite for timeline, reminders, and outbox access patterns.
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

| Level | Scope |
| --- | --- |
| Model | Pure rules, schemas, transitions, dates, units |
| Feature | Public interface with isolated SQLite |
| UI | Rendering, interaction, states, accessibility |
| Supabase | Migrations, RPC, Storage, RLS |
| Sync | Offline, retry, idempotency, conflicts, restart |
| E2E | P0 flows with Maestro on iOS and Android |

Use real local/test infrastructure by default. Do not add mock/fake implementations unless requested.

Required offline scenarios include restart before sync, network loss mid-push/upload, duplicate delivery, expired auth, migration with pending outbox, remote version conflict, timezone changes, and storage exhaustion.

CI runs typecheck, lint, tests, architecture checks, Supabase tests, Expo preview compile, and P0 E2E smoke flows.

## 16. Production readiness

- Separate development, preview, and production EAS profiles and Supabase projects.
- Use backward-compatible expand-migrate-contract database changes.
- Release OTA updates only when native runtime and schema remain compatible.
- Support staged rollout, crash monitoring, rollback, export, deletion, and tested restore.
- Measure cold start, navigation, query latency, dropped frames, and memory on mid-range Android.
- Never block first meaningful render on remote I/O.

## 17. AI-friendly development

- One feature directory, one public interface, one feature README.
- Thin routes and enforced dependency rules make change locations predictable.
- Invariants and failure modes live beside the public interface.
- Tests describe behavior at the seam and survive internal refactors.
- PRs stay small and feature-focused.
- Stable commands expose typecheck, lint, test, E2E, and database verification.

## 18. Implementation order

1. Bootstrap Expo Router, strict TypeScript, providers, and minimal UI primitives.
2. Add SQLite migrations, transactions, and boot state.
3. Build the complete `plants` slice.
4. Build local journal write and timeline read behavior.
5. Create Supabase schema, RLS, and generated types locally.
6. Add outbox and sync; verify offline restart before production connectivity.
7. Add guest-to-account auth and secure sessions.
8. Add reminders and local notifications.
9. Complete image sync, observability, E2E, and release gates.
