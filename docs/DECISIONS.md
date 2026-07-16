# Decision log

This file records confirmed decisions. Unvalidated ideas remain in `PROJECT_CONTEXT.md` or `TODO.md`.

## Recording decisions

Each entry includes a date, status, decision, and rationale. Valid statuses are `Proposed`, `Accepted`, and `Superseded`.

Hard-to-reverse technical decisions with real trade-offs belong in `docs/adr/` and are linked from this log.

## 2026-07-16 — Consolidate the unreleased SQLite schema as V1

**Status:** Accepted

**Decision:** Replace the development-only V2–V15 migration chain with one
complete V1 fresh-install schema. Existing development installations are
disposable and must reset or reinstall; no production-data repair path is
required. Future schema changes use forward-only migrations from V1.

Initialize SQLite by enabling WAL and foreign keys before reading the schema
version. Create the V1 schema and record `user_version = 1` in one exclusive
transaction so interruption cannot commit a partial schema as current.

**Rationale:** The application has not been released, so preserving prototype
database layouts adds migration risk without preserving user data. One atomic
baseline is easier to verify and removes the interrupted-migration failure mode
before the schema becomes a compatibility contract.

**Consequences:** Current plants, journal, fertilizer, spraying-target, and
schedule data contracts are unchanged. Earlier accepted decisions that name a
specific development migration version remain authoritative for behavior and
data shape, but their migration-number and backfill delivery details are
superseded by this baseline decision. Developers must delete or reset an older
local database before running this build. Once V1 ships, backward-compatible
forward migrations and recovery verification become mandatory.

## 2026-07-16 — Serialize local SQLite writes

**Status:** Accepted

**Decision:** Route every application-owned SQLite mutation through one shared
FIFO write queue. Multi-step writes additionally use
`withExclusiveTransactionAsync` and execute all statements through its supplied
transaction handle. Reads remain direct and may proceed independently.

**Rationale:** Expo's non-exclusive asynchronous transactions can include
unrelated queries that run while the transaction is active. Reminder
reconciliation and user saves can overlap, so explicit serialization prevents
one feature's write from entering or disrupting another feature's transaction.

**Consequences:** Writes wait for the active write to settle, including when it
fails; a rejection does not block later work. Aggregate journal saves keep
atomic rollback while unrelated writes cannot join them. This intentionally
trades parallel write throughput for deterministic local persistence, which
fits the MVP's small, user-driven mutation volume.

Idempotent activity and Plant Update inserts suppress only a conflict on their
client mutation ID, then verify that the saved mutation belongs to the same row
ID. A verified retry skips dependent child inserts because the original
aggregate transaction was atomic. Primary-key, foreign-key, check, and
unrelated uniqueness failures remain visible instead of being broadly ignored.

## 2026-07-16 — Show curated stage illustrations in preview Stage Playbooks

**Status:** Accepted

**Decision:** A review-stage Growth Stage Playbook may declare one optional
stable `image_id`. The preview bundle carries that ID and the mobile app resolves
it through a static, bundled WebP registry. The Stage Playbook hero shows the
illustration behind a dark contrast overlay and falls back to its primary-color
hero when no image resolves or an image fails to load. The first slice covers
the twelve grape stages only; there are no pest or disease images yet.

**Rationale:** Stage guidance is text-heavy. One relevant image makes the
general stage reference easier to scan without changing the user-owned plant
identity model.

**Consequences:** A stage illustration is never a Plant Update photo, proof of
the user's current stage, lifecycle progress, diagnosis, care recommendation,
or task. Review-stage images remain preview-only with their content. Production
publication additionally requires recorded source, licence, attribution,
Vietnamese alt text, and review status. The compiler ignores the `assets/`
directory as authored Markdown, while the app statically imports the approved
asset set for offline use.

## 2026-07-16 — Remove unlinked knowledge topics from the Knowledge Base

**Status:** Accepted

**Decision:** Remove `recommended_knowledge_topics` from authored Stage
Playbooks, normalized compiler types, and newly compiled Stage Playbooks. The
preview bundle moves to schema `2.0.0`; production remains `1.0.0`.

The mobile bundle schema accepts the former compiled field only as an optional
legacy property. Runtime readers ignore it, so existing `1.1.0` preview bundles
continue loading while new `2.0.0` bundles do not contain it. This supersedes
the retention clause in the preceding unresolved-exploration decision.

**Rationale:** The application has no reviewed destination for these prompts,
so keeping them in authored content creates unshipped, misleading knowledge.

**Consequences:** All current grape topic lists are removed without relocating
their claims. There is no user-data migration: activities, plants, reminders,
and care evaluation never stored or used the field. A future feature must model
each concrete guide or destination explicitly instead of restoring a free-text
topic list.

## 2026-07-16 — Do not show unresolved exploration prompts

**Status:** Accepted

**Decision:** Remove `recommendedKnowledgeTopics` from Plant Detail and Stage
Playbook presentation. The corresponding field was initially retained in the
Knowledge Base, then removed by the subsequent Knowledge Base cleanup decision.

**Rationale:** “Nên tìm hiểu” promises help without offering a next step. The
Stage Playbook should contain usable guidance, and Plant Detail should remain a
concise plant-context and history screen.

**Consequences:** Plant Detail no longer shows a topic-summary card. Stage
Playbook retains complete Care Plan, Care Guide, stage-threat, and exit-criteria
sections. The initial UI change required no schema, bundle, persistence,
recommendation, or reminder change.

## 2026-07-16 — Show stage-matched threat guidance in Stage Playbook

**Status:** Accepted

**Decision:** In the preview Stage Playbook only, show a read-only “Sâu bệnh
cần theo dõi” section for curated `pest` and `disease` targets whose species
and monitoring-stage relationships match the playbook. Each target is a
collapsed card with an explicit observation-only disclaimer; opening it reveals
the authored review-stage body. The section is omitted when no target matches.

This supersedes only the target-body display restriction and target-guide
deferral in the 2026-07-16 spraying-target history decision. It does not change
the target's meaning: stage relationships remain monitoring relevance, not
diagnosis, evidence of presence, treatment authorization, or a spraying
schedule. The section creates no Today card, reminder, care entry prefill,
evaluator input, activity record, or notification. The Plant Detail summary
remains compact and does not list threats.

**Rationale:** The Stage Playbook is the complete read-only reference for a
stage. Keeping threat guidance there lets growers inspect stage-relevant signs
and escalation boundaries without duplicating the material in care cards or
turning it into a task.

**Consequences:** The preview-knowledge interface exposes an optional,
stage-matched target list including title, type, and authored Markdown body.
Older `1.0.x` bundles without target arrays return an empty list. Production
still excludes review-stage targets until explicit content approval.

## 2026-07-16 — Record one optional curated target on spraying history

**Status:** Accepted

**Decision:** Keep one `spraying` activity type and let a grower optionally select one species-matched Pest or Disease while recording it. Persist the stable target ID and an immutable Vietnamese target-name snapshot as a nullable pair valid only for spraying. The UI may use only the target identity, type, and title from the review preview catalog; it must not expose or execute review-stage monitoring, prevention, or treatment content.

The field is labeled “Vấn đề muốn xử lý (không bắt buộc)” and records intent, not diagnosis, proof that the issue exists, treatment success, or pesticide authorization. It does not change Today or Plant Detail recommendation cards, evaluator eligibility, Care Plan schedules, or reminder reconciliation. Existing activities remain unchanged and use generic spraying text. Bundles without target arrays hide the selector without blocking entry.

**Rationale:** A nullable ID-and-snapshot pair makes spraying history more useful without coupling mutable Knowledge Base wording to past records or expanding the recommendation engine. One optional target keeps quick entry small; a target snapshot remains readable if catalog content is renamed or removed.

**Consequences:** SQLite migration V15 adds two nullable columns without a backfill. Care Entry gains reusable single-select chips, and history surfaces conditionally show the saved target name. Multi-target selection, free-text targets, purpose, product, method, target guides, target-aware recommendations, diagnosis, and management screens remain deferred. This supersedes only the saved-target and target-selection deferral in the preceding target-catalog decision. See [the spraying target UI integration report](./research/2026-07-16-spraying-target-ui-integration.md).

## 2026-07-16 — Establish curated pest and disease targets before target-aware spraying

**Status:** Accepted

**Decision:** Add `pest` and `disease` as schema-validated Knowledge Base document types with stable IDs, species and stage relationships, an explicitly empty Warning Sign relationship list until that entity type exists, review status, version, references, and required reviewed content sections. Start with review-only grape targets for bọ trĩ and bệnh phấn trắng. Compile these catalogs only into preview bundle schema `1.1.0`; keep the production bundle at `1.0.0` until qualified content approval and an explicit publish decision.

This approves stable target IDs for curated knowledge and supersedes only their deferral in the 2026-07-16 additive-care-guidance decision. It does not yet add a target to Care Plans, spraying history, recommendation evaluation, reminders, or UI. Stage relationships mean monitoring relevance, not diagnosis, pesticide authorization, or a schedule to spray.

**Rationale:** Target-aware entry and readable history need stable curated identity, but connecting targets directly to the current elapsed-time Care Plan engine would make issue relevance look like treatment eligibility and conflict with the one-plan-per-species/stage/activity scope. A preview-only taxonomy slice establishes validation and review boundaries without changing user behavior or stored data.

**Consequences:** The first catalogs are `pest.grape.thrips` and `disease.grape.powdery-mildew`. Existing Knowledge Base `1.0.0`, activities, reminders, and stage logic remain compatible. Warning Sign entities, optional Care Plan target scope, nullable activity target ID/name snapshots, target selection, target-aware summaries, product labels, and diagnosis remain separately sequenced work. See [the spraying target model and product impact report](./research/2026-07-16-spraying-target-model-impact.md).

## 2026-07-16 — Extend care guidance additively and keep foliar nutrition under fertilizing

**Status:** Accepted

**Decision:** Evolve the Care Plan and Care Activity contracts through optional backward-compatible fields rather than a breaking Knowledge Base revision. Care Plans may distinguish an actionable recommendation from a condition check, carry explicit check-before-acting guidance, optionally suggest a fertilizer application method, and optionally suggest a prevention or treatment purpose for spraying. Saved spraying activities may add nullable product-name, purpose, and target-name snapshots. Keep one `spraying` activity type for plant-protection spraying, and record foliar nutrition as `fertilizing` with `applicationMethod: foliar`.

Do not add the full `due`, `check`, `monitor`, `withhold`, and `not_applicable` model until reviewed inputs can calculate those states. Do not add recommended watering intensity, new spraying activity types, spray inventory, stable target-issue IDs, or automated weather and diagnosis behavior in this slice.

**Rationale:** The current elapsed-history evaluator cannot distinguish “perform now” from “inspect before deciding,” while fertilizing already has the concrete item and foliar-method contracts needed for nutritional spraying. Optional additions make watering condition-aware and spraying purpose-driven without invalidating Knowledge Base `1.0.0`, existing activity history, reminder snapshots, or stage logic.

**Consequences:** The first content follow-up is one narrow, sourced, review-stage spraying Care Plan with no commercial product or dosage prescription. Shipping the optional fields requires a Knowledge Base schema minor-version adapter, mode-aware Today and Plant Detail presentation, check-oriented notification wording, and nullable spraying-detail columns. Existing records receive display fallbacks and are never reclassified from their notes. See [the model and UI impact audit](./research/2026-07-16-knowledge-model-ui-impact.md).

## 2026-07-16 — Show latest saved fertilizer use in catalog management

**Status:** Accepted

**Decision:** Each “Quản lý phân bón” card shows its optional fertilizer group with an icon and text label, plus its newest saved Fertilizer Application. The catalog provides a wrapping group filter with an explicit “Tất cả” option. Latest use uses the same “Đã bón cho “{plant}”…” label as reviewed suggestion chips. The catalog identifies manual applications by their User Fertilizer ID and reviewed suggestions by their stable Knowledge Base ID when necessary.

**Rationale:** The catalog is the grower’s reusable record of fertilizers, so its list should provide enough saved context to distinguish an unused product from one recently applied without opening the Journal.

**Consequences:** Catalog persistence and an unsaved Care Entry draft never count as use history. The management projection reads local Fertilizer Applications and can continue showing history after a catalog record has been edited, while deletion still removes that catalog card without rewriting history.

## 2026-07-16 — Remove user-entered NPK ratios and reuse one fertilizer form

**Status:** Accepted

**Decision:** A User Fertilizer stores a required name and optional fertilizer group, but no separate NPK-ratio field. Fertilizer Applications snapshot the name and optional group without an NPK-ratio field. Contextual creation from fertilizing Care Entry and standalone add/edit from Fertilizer Management compose the same fertilizer form and validation behavior. This supersedes the NPK portions of the 2026-07-16 multiple-fertilizer-applications decision while retaining `npk` as a valid fertilizer group.

**Rationale:** A separate free-text NPK ratio adds catalog-entry friction without enough validated MVP value. Both entry paths operate on the same private catalog, so different fields and validation create avoidable inconsistency.

**Consequences:** The NPK ratio columns are removed through a forward SQLite migration, existing ratio values are discarded, and the application no longer captures or displays them. Curated Knowledge Base fertilizer names may still contain formulas, and the `npk` group remains available.

## 2026-07-16 — Save selected fertilizer suggestions to the private catalog

**Status:** Accepted

**Decision:** Selecting a reviewed fertilizer suggestion in Care Entry creates or reuses one User Fertilizer linked by the suggestion's stable Knowledge Base ID, then adds that catalog record to the in-memory fertilizing draft. Unselecting the suggestion removes it only from the draft and does not delete the catalog record. Suggestion chips show the newest saved Fertilizer Application for that stable ID as “Đã bón cho “{plant}” {days} ngày trước” or the same-day equivalent. This supersedes the no-user-record side effect in the 2026-07-16 inline-suggestion decision; the parent “Lưu hoạt động” action remains the only care-history write boundary.

**Rationale:** Suggestions should become reusable in “Quản lý phân bón” without repeated manual entry, while saved usage context helps growers distinguish a familiar input from one they have not recorded using. Stable IDs avoid treating matching names as identity.

**Consequences:** User Fertilizers gain an optional unique Knowledge Base ID and Fertilizer Applications snapshot that ID. Catalog persistence occurs on first suggestion selection even if the Care Entry is later dismissed, but “Đã bón…” reflects only saved activities. Deleting a catalog record does not remove historical usage provenance.

## 2026-07-16 — Use “Mở rộng” as the fourth tab and expose Fertilizer Management

**Status:** Accepted

**Decision:** Replace the persistent “Cài đặt” tab with “Mở rộng”. The More index exposes “Quản lý phân bón” alongside notification and Care Plan schedule settings. Fertilizer Management has two entry paths: contextual access from fertilizing Care Entry and persistent access through `Mở rộng → Quản lý phân bón`. Both routes operate on the same private User Fertilizer catalog; catalog changes create no Care Activity.

**Rationale:** Fertilizer records are reusable user-owned data rather than a one-time form detail, so growers need a place to maintain them outside a care event without losing the fast contextual path while recording. “Mở rộng” can hold this and other secondary destinations without making a configuration-only screen a primary tab.

**Consequences:** The 2026-07-15 Settings-tab decision is superseded. The persistent tab route is `/more`; notification and Care Plan configuration remain secondary `/settings/*` destinations beneath More. Fertilizer Management preserves the caller context so selection from Care Entry returns to its draft, while access from More remains standalone.

## 2026-07-16 — Save multiple fertilizer applications under one fertilizing activity

**Status:** Accepted

**Decision:** A fertilizing Care Activity may contain zero or more ordered, user-entered Fertilizer Applications. Each optional application records the fertilizer identity and may record its group, NPK, amount/unit, application method, and item note. Nested add/edit/remove screens modify only the Care Entry draft; the parent “Lưu hoạt động” action atomically saves the activity and its applications.

**Rationale:** Home growers may apply more than one product at the same time, and splitting one occurrence into several Care Activities would duplicate plant, time, origin, general notes, and save work. A child-record model preserves one trustworthy event while keeping optional product detail structured.

**Consequences:** The target user-data model changes from one fertilizing-detail record per activity to a one-to-many aggregate. An application may snapshot a selected User Fertilizer so catalog edits or deletion cannot rewrite history. Curated Fertilizer Profiles remain Knowledge Base content and are not created or linked by matching free text. Implementation requires explicit schemas, migration, aggregate save/edit/delete behavior, draft-preserving navigation, and tests before the mockups can ship.

## 2026-07-16 — Select reviewed fertilizer suggestions inline

**Status:** Accepted

**Decision:** A fertilizing Care Entry may show structured fertilizer suggestions authored by its applicable Care Plan as inline, wrapping, selectable chips. Tapping a chip adds or removes a fertilizer snapshot in the in-memory draft without opening the application editor. The parent “Lưu hoạt động” action remains the only history-write boundary. “Thêm loại phân” remains the path for manual catalog selection and optional application details.

**Rationale:** A grower can record a suggested fertilizer with one selection and one explicit confirmation instead of traversing add and edit sheets, while the explicit Save boundary preserves trustworthy history and the manual path covers products and details outside reviewed suggestions.

**Consequences:** Care Plan fertilizer suggestions require stable IDs, Vietnamese names, canonical fertilizer groups, source review, and compiler validation. Fertilizing recommended inputs no longer carry free-text examples. Chips wrap on mobile without horizontal scrolling and expose selected state accessibly.

## 2026-07-15 — Keep UI localization static and Vietnamese-only

**Status:** Accepted

**Decision:** Resolve all application-owned user-facing copy through a typed, language-neutral key catalog with `vi-VN` as the only shipped locale. Keep curated Knowledge Base content in its separate locale-aware repository. Defer runtime locale selection, device-locale detection, persistence, fallback chains, and alternate catalogs until another language is delivered.

**Rationale:** Translation keys remove embedded UI copy now without adding unused runtime state or dependencies. Knowledge content has separate review, version, source, and locale contracts that must not be collapsed into application chrome.

**Consequences:** UI copy, accessibility labels, alerts, and notifications share one Vietnamese catalog. Expo build-time config keeps its static native permission descriptions beside the config because Expo's config loader cannot resolve the TypeScript runtime catalog; it is an explicit build-time exception. Models expose language-neutral facts where presentation varies. Adding the first alternate locale later requires catalog selection and narrow root locale state, while existing keys and call sites remain reusable.

**Alternatives:** Adding an i18n dependency or locale provider now would create unused switching, fallback, and persistence behavior while the product still ships one language.

## 2026-07-11 — Use ordered lifecycle metadata for growth stages

**Status:** Accepted

**Decision:** Growth stages remain ordered within the existing development and production lifecycles. Playbooks declare review-stage context through `primary_objective`, `entry_criteria`, `exit_criteria`, duration, knowledge topics, and sources; they do not encode transition actions, task state, or executable recommendation links.

**Rationale:** Ordered lifecycle metadata preserves the established grape journey without requiring a rule engine, automatic transition, or task-completion model. It keeps review content concise and prevents unreviewed operational guidance from becoming product behavior.

## 2026-07-11 — Keep review-stage playbooks informational and non-executable

**Status:** Accepted

**Decision:** Remove default reminder templates and UX, behavioral, task, auto-transition, and unsupported-state prescriptions from stage playbooks and their compiled mobile contract. Review-stage content remains informational and does not create reminders, actions, history, or stage changes.

**Rationale:** The pilot is review-stage knowledge, not an automation contract. Removing these fields keeps the product's explicit-save history model intact and prevents unsupported agronomic content from being presented as a directive.

**Consequences:** The compiler validates and bundles concise stage metadata only. Future care suggestions or reminders require separately reviewed product behavior and knowledge contracts.

**Alternatives:** Retaining templates or task metadata would imply scheduling and execution behavior that the MVP does not implement.

## 2026-07-10 — Make gardening history the core value

**Status:** Superseded by the 2026-07-11 guidance-first decision

**Decision:** Prioritize recording and retrieving plant-care history. Reminders and future guidance support the journal rather than replace it.

**Rationale:** Historical records are the founding product need and the data foundation for later assistance.

## 2026-07-10 — Defer technology selection

**Status:** Superseded by the 2026-07-11 decision

**Decision:** Initially defer framework, database, cloud, and release-platform choices until the main user journey and offline needs are understood.

**Rationale:** Early technology choices would have relied on untested assumptions.

## 2026-07-11 — Select the mobile stack

**Status:** Accepted

**Decision:** Use Expo, React Native, TypeScript, Expo Router, Supabase, TanStack Query, React Hook Form, and Zod. Use feature-first organization and local-first persistence with SQLite.

**Rationale:** The chosen stack supports mobile delivery, runtime validation, clear state ownership, offline entry, and Supabase-backed auth, Postgres, Storage, and synchronization.

## 2026-07-11 — Keep weather lightweight

**Status:** Superseded by the 2026-07-11 contextual-guidance decision

**Decision:** Weather appears as contextual cards on Today and Plant Detail. MVP excludes a dedicated forecast screen, alerts, and automated weather-aware scheduling.

**Rationale:** Current conditions can improve care decisions without distracting from quick logging or turning the product into a weather application.

## 2026-07-11 — Make guidance the core product value

**Status:** Superseded by the 2026-07-11 track-essential-care decision

**Decision:** Position the product as an intelligent gardening coach. Stage-based guidance and recommended tasks are primary; journal history is created naturally from completed work.

**Rationale:** Beginners need help deciding what to do and why. A blank journal records decisions but does not reduce uncertainty or teach users how to progress.

## 2026-07-11 — Use deterministic guidance for MVP

**Status:** Superseded by the 2026-07-11 derived-care-suggestions decision

**Decision:** Generate MVP recommendations from reviewed grape stage playbooks and deterministic weather rules. Do not use generative AI for care recommendations.

**Rationale:** Deterministic rules are explainable, testable, sourceable, and safer for a narrow MVP. The structured model remains ready for later AI personalization.

## 2026-07-11 — Let weather modify recommendations

**Status:** Accepted

**Decision:** Weather may prioritize, delay, suppress, or annotate care suggestions. MVP still excludes a weather destination, alerts, and complex automated scheduling.

**Rationale:** Weather is valuable when it changes a care decision. Display-only weather misses that value, while a full forecasting product would distract from guidance.

## 2026-07-11 — Create journal entries from task completion

**Status:** Superseded by the 2026-07-11 explicit-activity-save decision

**Decision:** Completing a recommended task atomically marks the task complete and creates one attributed journal entry. Notes and photos remain optional and editable.

**Rationale:** This removes duplicate work while preserving an accurate history. Attribution and editability prevent automatic entries from becoming opaque or irreversible.

## 2026-07-11 — Track essential care and keep stage tips informational

**Status:** Superseded by the 2026-07-11 track-three-core-care-types decision

**Decision:** Treat watering, fertilizing, pruning, spraying, and observations as trackable activities. Show stage guidance as non-trackable tips inside Plant Detail.

**Rationale:** Users need reliable care history more than another task system. Informational techniques and cautions add context but do not need completion, reminders, or journal entries.

## 2026-07-11 — Record activity only after explicit Save

**Status:** Accepted

**Decision:** A Today care prompt or reminder may open a prefilled Care Entry, but history is created only after the user confirms the performed activity by saving it.

**Rationale:** A recommendation is not evidence that care happened. Explicit Save keeps history trustworthy while preserving a fast entry path.

## 2026-07-15 — Record watering with quick-select intensity

**Status:** Accepted

**Decision:** Every newly saved watering activity records one stable intensity: `light`, `moderate`, `deep`, or `rain`. Care Entry presents “Tưới nhẹ”, “Tưới vừa”, “Tưới đẫm”, and “Mưa” as one-tap choices, then uses the existing explicit “Lưu hoạt động” action as confirmation. Estimated liters remain optional under collapsed “Thêm chi tiết”; the app never derives or prefills volume from intensity. Legacy amount-only rows keep a null intensity and display that uncertainty without inference.

**Rationale:** Growers can reliably recall relative watering intensity more often than exact volume. Stable language-neutral codes support persistence and localization, while explicit Save preserves trustworthy history and nullable migration compatibility avoids fabricating past data.

## 2026-07-11 — Derive care suggestions without persistent tasks

**Status:** Accepted

**Decision:** Compute contextual care suggestions from stage, weather, reminders, and recent history. Do not persist suggestion instances or task-completion state in MVP.

**Rationale:** Derived suggestions provide useful timing context without adding task lifecycle, deduplication, skip, completion, or automatic-history complexity.

## 2026-07-11 — Store MVP knowledge as Markdown

**Status:** Accepted

**Decision:** Store curated plant knowledge as schema-validated Markdown in Git, separate from user data and accessed through a Knowledge Repository interface.

**Rationale:** Markdown is reviewable, versioned, inexpensive, offline-bundle friendly, and sufficient for the initial editorial volume. The repository seam allows later PostgreSQL, CMS, vector, or RAG adapters.

## 2026-07-11 — Preserve stable knowledge IDs across storage systems

**Status:** Accepted

**Decision:** Knowledge documents and relationships use immutable, language-neutral IDs and explicit versions across Markdown, PostgreSQL, CMS, and vector indexes.

**Rationale:** Stable identity prevents storage migration, localization, or wording changes from breaking playbook relationships, suggestion provenance, or saved-activity explanations.

## 2026-07-11 — Keep rule execution deterministic and outside RAG

**Status:** Accepted

**Decision:** Execute only schema-validated rules with allowlisted facts, operators, and effects. Vector retrieval may supply explanations and evidence but never executable care logic.

**Rationale:** Deterministic rules are testable, reviewable, conflict-checkable, and safe to run offline. Semantic retrieval is probabilistic and unsuitable as the source of rule execution.

## 2026-07-11 — Separate navigation destinations from logging

**Status:** Superseded by the 2026-07-11 contextual-actions-without-fab decision

**Decision:** Bottom navigation contains “Hôm nay”, “Cây trồng”, “Nhật ký”, and “Tôi”. A bottom-right FAB opens quick logging. Reminder management becomes secondary.

**Rationale:** The four tabs are persistent places users revisit. Logging is a global action, while reminders are encountered mainly through daily and plant context. This gives cross-plant history a justified destination.

## 2026-07-11 — Track three core care types

**Status:** Accepted

**Decision:** Use dedicated activity records only for watering, fertilizing, and spraying. Capture pruning, observations, growth, and other updates as photo-and-note journal entries.

**Rationale:** The three core activities provide the most useful recurring care history. A flexible journal preserves other context without adding equal-weight forms and reminder behavior for every subactivity.

## 2026-07-11 — Use contextual actions without a FAB

**Status:** Accepted

**Decision:** Remove the global FAB and Quick Action menu. Put relevant care buttons under “Việc cần làm hôm nay”, expose “Thêm nhật ký” contextually, and keep optional stage changes inside that journal flow.

**Rationale:** Today already presents the actions users should take. Contextual actions reduce duplication, keep plant selection clear, and prevent secondary activities from competing with core care.

## 2026-07-11 — Update stage inside the journal flow

**Status:** Accepted

**Decision:** Remove the standalone “Cập nhật giai đoạn” action. Show the confirmed current stage inside “Thêm nhật ký” and let the user optionally change it before saving the journal entry.

**Rationale:** Photos are the natural evidence of plant development. Combining both actions removes another screen entry point while preserving explicit user confirmation and stage history.

## 2026-07-11 — Bootstrap on Expo SDK 57

**Status:** Accepted

**Decision:** Start the application on Expo SDK 57 with React Native 0.86 and require Node.js 22.13 or newer. Keep routes thin, expose only the four approved destinations, and activate infrastructure libraries only when a real feature needs them.

**Rationale:** SDK 57 is Expo's current new-project baseline and provides the supported Router and React Native versions. Declaring the Node requirement prevents inconsistent Metro behavior, while incremental infrastructure activation avoids placeholder integrations and keeps each feature slice testable.

## 2026-07-11 — Require confirmation for future photo stage detection

**Status:** Accepted

**Decision:** Future AI may suggest a growth stage from a journal photo, but it must never update the confirmed plant stage automatically.

**Rationale:** Image interpretation can be uncertain. Showing a candidate with confidence helps the user, while confirmation keeps the plant timeline and guidance context trustworthy.

## 2026-07-12 — Start deterministic care guidance with one general history rule

**Status:** Accepted

**Decision:** Implement the first Today guidance slice with one reviewed general watering definition for grape trunk development. The evaluator returns only `recommended`, `not_recommended`, or `unavailable`, retains negative explanations in “Đã xem xét”, and writes no task state. It considers stage and saved care history only.

**Rationale:** A small explainable slice validates the daily-coach experience without modeling unreviewed climate, growing-method, weather, observation, profile, or generalized-rule behavior.

**Consequences:** Today can explain why care is or is not suggested, while future context dimensions require a separate reviewed vertical slice rather than empty extension abstractions.

## 2026-07-12 — Stage Playbook screen is not plant-specific

**Status:** Accepted

**Decision:** `StagePlaybookScreen` shows general stage guidance only (objective, care guide, knowledge topics, exit criteria, next stage). It does not display the plant's name, photo, or any plant-specific identity. The `plant` prop was removed from the component contract.

**Rationale:** Stage playbooks are curated content about a growth stage, not about a particular plant. Embedding plant identity in the screen would imply personalization that does not exist; the same guidance applies to all plants in the same stage.

## 2026-07-12 — Stage Playbook uses stageId query param for forward browsing

**Status:** Accepted

**Decision:** The route `app/plants/[id]/guide.tsx` accepts an optional `stageId` query parameter. When absent, it falls back to `plant.stageId`. The "Sắp tới" card pushes the same route with `{ id, stageId: nextStage.id }`, enabling forward browsing through stages.

**Rationale:** A dedicated `/knowledge/stages/[stageId]` route would lose plant context needed for the back-navigation fallback and for future plant-specific prefills. Keeping the route under `/plants/[id]/guide` and passing `stageId` as an override param keeps the URL legible, preserves plant context, and avoids a second route hierarchy.

**Consequences:** The route reads the plant record from SQLite on every navigation (one query). All knowledge lookups are synchronous from the compiled preview bundle.

## 2026-07-13 — Make Care Guide the single source for care knowledge

**Status:** Superseded by the 2026-07-13 consolidated Care Plan decision

**Decision:** `care_guide` owns reusable user-facing care content: title, goal, Markdown instructions, frequency, recommended inputs, and notes. Every `care_plan` references exactly one guide and owns only species/stage scope, activity type, eligibility, missing-history policy, and priority. The derived recommendation resolves both records without persisting task state. Stage Playbooks remain informational and do not own this relationship. Dedicated activity types remain watering, fertilizing, and spraying; pruning guides stay informational and pruning remains a Plant Update.

**Rationale:** Care instructions previously appeared in both guide and recommendation records, letting revisions drift and allowing UI to choose an unrelated first guide for a stage. A required guide relationship keeps one editable authority while retaining deterministic suggestion rules.

**Consequences:** Compiler validation rejects missing, wrong-type, out-of-scope, or ineligible guide relationships. Recommendation definitions no longer carry user-facing instructions. Existing review-stage grape content remains excluded from production until approved.

## 2026-07-13 — Consolidate tracked care guidance into Care Plans

**Status:** Accepted

**Decision:** A `care_plan` is the single authored source for stage-scoped watering, fertilizing, and spraying guidance. It owns its user-facing title, goal, optional growing-method frequency, recommended inputs, notes, activity scope, eligibility, missing-history policy, and priority. A `care_guide` remains generic informational knowledge, such as training or pruning technique, and is not linked to a tracked care recommendation.

**Rationale:** Farmers need one complete stage-aware record for care they track. Splitting presentation content from recommendation logic created duplicate authoring and an unnecessary relationship for the MVP, while generic techniques have a different informational purpose.

**Consequences:** Stage Playbook and recommendation detail surfaces resolve tracked care content directly from Care Plans. Generic Care Guides remain read-only and never create activities, reminders, recommendations, or history. Review-stage content remains excluded from production until approved.

## 2026-07-13 — Allow plant-scoped Quick Care on Plant Detail

**Status:** Accepted

**Decision:** Plant Detail may show one local Quick Care FAB. It opens plant-scoped watering, fertilizing, or spraying Care Entry and never saves activity directly. The app still has no global FAB, and Today remains FAB-free. This narrowly supersedes the Plant Detail portion of the 2026-07-11 contextual-actions-without-FAB decision.

**Rationale:** Plant Detail already provides unambiguous plant context. One local entry point keeps all three core care actions reachable while the main care cards prioritize watering and fertilizing. Explicit Save remains the only history-write boundary.

## 2026-07-13 — Add journal updates to the Plant Detail action menu

**Status:** Accepted

**Decision:** Plant Detail keeps one plant-scoped floating action menu with four explicit choices: watering, fertilizing, spraying, and “Thêm nhật ký”. While closed, the control may cycle through those four icons about every three seconds with a left-to-right slide, a brief button bounce, and the matching activity background color, then show a close icon while expanded. It must pause idle animation while open, respect reduced-motion preferences, and expose a stable Vietnamese accessibility label independent of the decorative icon. Selecting an action only opens its entry flow; history changes only after the user saves.

Journal photos remain owned by Plant Updates. Plant Detail derives its displayed plant image from the first photo of the newest photo-bearing saved update by occurrence time. A note-only update does not replace the image, and no duplicate photo pointer is stored on the Plant.

**Rationale:** The plant context is already fixed, and a photo journal update is the next common plant-scoped record alongside the three core care activities. Deriving the image from journal history keeps one source of truth and allows future entry edits or deletion to fall back naturally to the next newest photo.

**Consequences:** This supersedes the three-choice limit in the 2026-07-13 Plant Detail Quick Care decision while preserving its local-only scope and explicit-save boundary. The app must persist Plant Updates and photo metadata before rendering a plant photo. Today remains FAB-free.

## 2026-07-13 — Browse Stage Playbooks by authored transitions

**Status:** Accepted

**Decision:** The Stage Playbook "Sắp tới" action resolves the current stage's authored transition instead of deriving the next stage from sequence within one lifecycle. It may therefore move from the final development stage into the first production stage, and follow repeatable production-cycle transitions. It only browses guidance and never changes the plant's confirmed stage.

**Rationale:** Lifecycle boundaries do not necessarily mark the end of a plant's authored stage journey. The species knowledge already declares explicit transitions, including development into production, which are more precise than an implementation-only sequence rule.

**Consequences:** A stage without an authored transition still has no "Sắp tới" card. Transition targets without a stage playbook are treated as unavailable rather than inferred.

## 2026-07-14 — Make the latest persisted photo the Plant Detail hero

**Status:** Accepted

**Decision:** When a plant has a persisted journal photo, Plant Detail presents the latest derived photo as a rounded 16:9 hero. The plant name and species appear at the bottom over a dark contrast gradient, and tapping the hero opens the uncropped image in a full-screen viewer. The lifecycle journey is the screen's single visible current-stage identifier; the hero and objective card do not repeat the stage title. Without a persisted photo, Plant Detail uses a compact leaf identity fallback rather than a large placeholder.

**Rationale:** A prominent real photo makes journal updates visibly valuable and helps the grower recognize the plant. Consolidating stage identity in the journey removes three competing repetitions while preserving the confirmed stage and ordered lifecycle context.

**Consequences:** The photo continues to derive from the newest photo-bearing saved Plant Update; no Plant-owned photo pointer or inferred image is introduced. The hero scrolls with content, the plant-scoped action menu remains floating, and the objective card uses a labelled “Xem hướng dẫn chi tiết” action. Plant lists and entry flows keep the shared compact `PlantIdentity` treatment because they do not show the lifecycle journey.

## 2026-07-14 — Use persisted photos across compact plant identity

**Status:** Accepted

**Decision:** Compact plant identity surfaces use the first photo from the newest photo-bearing saved Plant Update. This includes Plant List, Today priorities and care entry, care/activity details, Journal care rows, and new-journal entry context. Missing or unreadable photos retain the leaf fallback. Historical Plant Update rows may prefer the photo attached to that specific update because it represents the event being reviewed. Today presents “Khu Vườn Của Tôi” as horizontal photo-first cards and places the labelled “Thêm cây” action in the section heading.

**Rationale:** A real photo lets growers distinguish plants faster and makes taking journal photos useful throughout the app. Deriving identity from Plant Updates preserves one source of truth, while a dedicated Today card treatment gives the bottom section enough visual structure without introducing placeholder images.

**Consequences:** `Plant` gains no image field or duplicated pointer. Query projections that render compact identity load Plant Updates and derive a per-plant URI map; photo failures affect only presentation. Today remains FAB-free, plant-card text remains available without the image, and saving a Plant Update invalidates the shared plant-photo query.

## 2026-07-14 — Show mixed recent journal history on Plant Detail

**Status:** Accepted

**Decision:** Plant Detail labels its recent-history section “Nhật ký gần đây” and shows the three newest saved journal entries by occurrence time, interleaving Care Activities and Plant Updates. Each record keeps its domain type and opens its corresponding detail screen.

**Rationale:** A photo, note, pruning observation, or confirmed stage update is part of the plant's recent history even though it is not a dedicated watering, fertilizing, or spraying activity. Showing only core care made the Plant Detail history incomplete immediately after saving a plant update.

**Consequences:** The Plant Detail projection reuses the Journal's mixed `JournalItem` ordering and applies the three-entry display limit after interleaving. This does not reclassify Plant Updates as Care Activities, add task state, or complete the broader reminder-aware Timeline backlog.

## 2026-07-14 — Rotate source-backed plant age metadata

**Status:** Accepted

**Decision:** Plant Detail places an age pill beside the species pill. Current-stage age is derived only from nullable persisted `stageStartedAt`; planted age is derived only from optional user-provided `plantedAt`. When both exist, the pill starts with current-stage age and switches to planted age every ten seconds using a short vertical slide and crossfade. One value remains static, no values omit the pill, and reduced motion shows both available labels statically. Accessibility exposes one stable label containing all available values.

**Rationale:** Stage age is useful context for stage-aware care, while planted age gives broader plant context. A compact rotating pill uses existing hero space without adding another section, but the two concepts must remain visibly and structurally distinct to avoid false biological precision.

**Consequences:** SQLite adds nullable `plants.stage_started_at`. Confirmed journal stage changes update it atomically with the current stage. Migration backfills only from the newest matching persisted stage-history row and never from `createdAt` or `plantedAt`; initial stage age therefore remains absent when its start is unknown. The Plant Detail projection calculates non-future elapsed local calendar days and provides truthful same-day labels.

## 2026-07-14 — Customize Care Plan schedules through user snapshots

**Status:** Accepted

**Decision:** Care Plans remain curated read-only knowledge. Users may customize only schedule snapshots: interval, notification delivery, and notification time. A stage snapshot belongs to one exact Care Plan ID and may optionally replace authored frequency for both growing methods. A plant snapshot copies the complete current effective schedule and takes precedence over a stage snapshot, which takes precedence over authored Care Plan defaults. Resetting a plant snapshot restores stage/default inheritance. Pause is not supported.

**Notification behavior:** Delivery defaults off. Enabling it without saved time uses 08:00 local time. A due schedule may send one notification at its due time and one follow-up the next local day; neither notification creates history or a second Today card. Saving matching care cancels pending delivery and recalculates from saved activity history.

**Lifecycle:** Plant snapshots persist when their Care Plan stops applying and reactivate unchanged if that exact Care Plan applies again. A confirmed stage change surfaces affected Care Plan names without blocking the saved journal entry. Existing V7 reminder data may be discarded because no production user data exists.

**Rationale:** Separate user scheduling choices from reviewed care knowledge, make stage defaults reusable, and keep plant-specific behavior predictable rather than silently changing after a stage edit.

## 2026-07-15 — Make Settings persistent tab

**Status:** Superseded by the 2026-07-16 “Mở rộng” tab decision

**Decision:** Replace the former “Tôi” tab with “Cài đặt”. Settings is the fourth persistent destination and exposes only shipped notification and Care Plan schedule configuration. Remove the Me feature and `/me` route; MVP has no profile or account destination.

**Rationale:** The former Me screen only linked to Settings, creating duplicate navigation without owned behavior. Making Settings direct reduces one step and deletes unused feature code.

**Consequences:** `/settings` remains the canonical tab deep link. Older decisions that name “Tôi” as a destination are superseded only for tab identity; Today, Plants, Journal, and contextual care behavior remain unchanged.

## 2026-07-15 — Split stage frequency by growing method

**Status:** Accepted

**Decision:** A stage schedule snapshot belongs to one exact Care Plan and stage. It stores independent ground and container frequency overrides plus one shared notification delivery/time setting. This supersedes only the shared-frequency clause in the 2026-07-14 schedule-snapshot decision; plant snapshot precedence and all other behavior remain unchanged.

**Rationale:** Authored Care Plan frequency already differs by growing method, but notification intent applies to the Care Plan rather than duplicating two notification controls. Separate frequency fields preserve timing differences without creating conflicting notification policies.

**Consequences:** SQLite keeps uniqueness on `(stage_id, care_plan_id)` and adds two frequency columns. Resolution selects the plant's matching frequency field and the shared notification policy. Existing V8 shared frequency copies into both fields during migration.

## 2026-07-16 — Browse Stage Playbooks from More

**Status:** Accepted

**Decision:** Rename the More destination to “Chăm sóc theo giai đoạn”. Each stage detail renders the shared Stage Playbook. Every tracked Care Plan keeps its authored “Tần suất tham khảo” read-only and shows a compact “Lịch của bạn” editor for its user-owned stage schedule snapshot. A right-aligned check icon explicitly saves the complete schedule draft; keyboard submit invokes the same save when available. Plant Detail keeps its contextual, read-only Playbook entry.

**Rationale:** A Playbook is complete stage guidance, while a Care Plan is one activity-focused schedule. Embedding a clearly labelled user-owned schedule editor in the relevant Care Plan removes a duplicate screen without implying that users can edit curated agricultural guidance or that the Playbook is a task.

**Consequences:** The stage schedule route uses an authored stage ID and can display stage-matched threats without loading a plant. Plant-scoped navigation remains supported as the read-only contextual entry. Care Plan and informational-guide cards remain compact until opened, with their icon and title replacing redundant text. No Knowledge Base schema, SQLite schema, schedule snapshot, reminder, or activity-record migration is required.

## Decision template

```md
## YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Decision:** What was selected.

**Rationale:** The context and trade-off behind the choice.
```
