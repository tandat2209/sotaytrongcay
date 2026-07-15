# Decision log

This file records confirmed decisions. Unvalidated ideas remain in `PROJECT_CONTEXT.md` or `TODO.md`.

## Recording decisions

Each entry includes a date, status, decision, and rationale. Valid statuses are `Proposed`, `Accepted`, and `Superseded`.

Hard-to-reverse technical decisions with real trade-offs belong in `docs/adr/` and are linked from this log.

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

**Status:** Accepted

**Decision:** Replace the former “Tôi” tab with “Cài đặt”. Settings is the fourth persistent destination and exposes only shipped notification and Care Plan schedule configuration. Remove the Me feature and `/me` route; MVP has no profile or account destination.

**Rationale:** The former Me screen only linked to Settings, creating duplicate navigation without owned behavior. Making Settings direct reduces one step and deletes unused feature code.

**Consequences:** `/settings` remains the canonical tab deep link. Older decisions that name “Tôi” as a destination are superseded only for tab identity; Today, Plants, Journal, and contextual care behavior remain unchanged.

## 2026-07-15 — Split stage frequency by growing method

**Status:** Accepted

**Decision:** A stage schedule snapshot belongs to one exact Care Plan and stage. It stores independent ground and container frequency overrides plus one shared notification delivery/time setting. This supersedes only the shared-frequency clause in the 2026-07-14 schedule-snapshot decision; plant snapshot precedence and all other behavior remain unchanged.

**Rationale:** Authored Care Plan frequency already differs by growing method, but notification intent applies to the Care Plan rather than duplicating two notification controls. Separate frequency fields preserve timing differences without creating conflicting notification policies.

**Consequences:** SQLite keeps uniqueness on `(stage_id, care_plan_id)` and adds two frequency columns. Resolution selects the plant's matching frequency field and the shared notification policy. Existing V8 shared frequency copies into both fields during migration.

## Decision template

```md
## YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Decision:** What was selected.

**Rationale:** The context and trade-off behind the choice.
```
