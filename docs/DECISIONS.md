# Decision log

This file records confirmed decisions. Unvalidated ideas remain in `PROJECT_CONTEXT.md` or `TODO.md`.

## Recording decisions

Each entry includes a date, status, decision, and rationale. Valid statuses are `Proposed`, `Accepted`, and `Superseded`.

Hard-to-reverse technical decisions with real trade-offs belong in `docs/adr/` and are linked from this log.
## 2026-07-11 — Replace stage graph with sequence and state-machine criteria

**Status:** Accepted

**Decision:** Growth stages are now modeled as a sequential state machine ordered by `sequence`, replacing the previous directed graph (`next_stage_id`). Stages now declare `entry_criteria`, `exit_criteria`, `stage_group` (development vs. production), and `repeatable` to drive the UX. Hardcoded links like `care_recommendation_ids` and `guide_ids` were removed from playbooks.

**Rationale:** The directed graph approach was brittle and didn't match the reality of plant growth, which features a one-time structural phase (development) followed by repeating seasonal cycles (production). Removing hardcoded arrays for recommendations allows the system to query guidance dynamically based on current conditions.


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

## Decision template

```md
## YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Decision:** What was selected.

**Rationale:** The context and trade-off behind the choice.
```
