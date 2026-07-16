# Spraying target model and product impact

**Date:** 2026-07-16
**Status:** Accepted implementation scope
**Scope:** Curated pest and disease targets for spraying; no runtime recommendation, activity, reminder, or diagnosis behavior in this slice

**Follow-up:** The separately approved [spraying target UI integration](./2026-07-16-spraying-target-ui-integration.md) later implements the optional saved target ID/name snapshot and entry selector while preserving the recommendation and diagnosis boundaries below.

## Outcome

Add `pest` and `disease` as schema-validated Knowledge Base document types and compile review-stage targets into the preview bundle. Start with:

- `pest.grape.thrips` / “Bọ trĩ hại nho”;
- `disease.grape.powdery-mildew` / “Bệnh phấn trắng trên nho”.

This is a backward-compatible Knowledge Base extension. It does not yet connect a target to a Care Plan or saved spraying activity. It therefore does not change Today cards, Plant Detail cards, Care Entry, activity history, reminders, or stored user data.

The catalog describes issues that may be relevant and evidence a grower can inspect. A target selection must never be presented as a diagnosis. `stageIds` means that the issue is relevant for monitoring during those stages; it does not mean spraying is required, safe, registered, or due.

## Changes in this slice

| Field or concept               | Current model                                                               | Proposed model                                                                                                                       | Change type                         | Reason                                                                                                               | UI impact                                       | Engine impact | Data migration                                   |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------- | ------------------------------------------------ |
| Pest knowledge entity          | Described conceptually but unsupported by schemas and compiler              | Authored `pest` document with stable ID, affected species/stages, warning-sign links, reviewed body, status, version, and references | Backward-compatible model extension | Give future target selection a curated identity instead of free text                                                 | None now                                        | None now      | None                                             |
| Disease knowledge entity       | Described conceptually but unsupported by schemas and compiler              | Authored `disease` document with the same shared identity and relationship fields                                                    | Backward-compatible model extension | Distinguish disease knowledge from pest knowledge without changing activity types                                    | None now                                        | None now      | None                                             |
| Preview bundle target catalogs | Bundle `1.0.0` has no target catalogs                                       | Preview bundle `1.1.0` adds `pests` and `diseases`; production remains `1.0.0` until content approval                                | Backward-compatible model extension | Let reviewers inspect compiled target data without publishing it                                                     | Current preview consumer ignores the new arrays | None          | Regenerate preview only                          |
| Warning-sign links             | Architecture defines stable Warning Sign entities, but none are implemented | Keep required `warningSignIds` arrays empty and provide reviewed observable-sign sections in the target documents                    | Transitional additive contract      | Avoid inventing unresolved IDs while preserving the eventual relationship field                                      | None now                                        | None          | None; populate after Warning Sign entities exist |
| Target on Care Plan            | No target relationship                                                      | Deferred optional `sprayTargetIds` or a separate target-aware plan contract                                                          | Deferred                            | The current one-plan-per-species/stage/activity rule and elapsed-time engine cannot safely evaluate multiple targets | None now                                        | None now      | None                                             |
| Target on saved spraying       | Generic spraying activity                                                   | Deferred nullable stable target ID plus target-name snapshot                                                                         | Deferred                            | Stable knowledge must exist before history refers to it                                                              | None now                                        | None now      | None                                             |

The target body must contain non-empty reviewed sections for observable evidence, risk or damage context, prevention, safe first response, and escalation. This is content structure, not an executable treatment rule.

## Field-by-field product answers

### `id` and `type`

- **Screens reading it now:** none; compiler and validators only.
- **Shown directly:** no.
- **Recommendation card appearance:** unchanged.
- **Quick-entry form:** unchanged.
- **Saved activity:** unchanged.
- **Reminder reconciliation:** unchanged.
- **New UI elements:** none now. A later selector would need pest/disease labels or icons, but this slice does not add them.
- **Older bundles:** continue to work because their existing arrays and meanings are unchanged; the preview consumer does not require target arrays.
- **Older activity records:** unchanged and display normally.

### `speciesIds` and `stageIds`

- **Screens reading it now:** none.
- **Shown directly:** no.
- **Recommendation card appearance:** unchanged; target stage relevance is not recommendation eligibility.
- **Quick-entry form:** unchanged.
- **Saved activity and reminders:** unchanged.
- **New UI elements:** none.
- **Compatibility:** older bundles and activities require no fallback because no current screen reads these fields.

### `warningSignIds`

- **Screens reading it now:** none.
- **Shown directly:** no.
- **Recommendation, entry, saved activity, and reminder effects:** none.
- **New UI elements:** none.
- **Fallback:** an empty list means no normalized Warning Sign relationship has been authored. It must not mean “no warning signs.” The reviewed Markdown remains available to content reviewers.

### `title`, optional `scientificName`, and `bodyMarkdown`

- **Screens reading it now:** none.
- **Shown directly:** no.
- **Recommendation, entry, saved activity, and reminder effects:** none.
- **New UI elements:** none now. A later read-only issue guide may show the Vietnamese title and reviewed sections.
- **Fallback:** a future selector must use the Vietnamese `title`; it must not require a scientific name.

### `status`, `version`, and `references`

- **Screens reading it now:** none.
- **Shown directly:** no.
- **Recommendation, entry, activity, and reminder effects:** none.
- **Compatibility:** `review` targets compile only into preview. The production bundle remains unchanged until qualified approval and an explicit publish decision.

## Product-surface review

### Today recommendation cards

No change. Target entities do not make a spraying card appear, change its wording, or establish `due`, `check`, `monitor`, `withhold`, or `not_applicable`. The existing review-stage powdery-mildew Care Plan remains governed only by its current Care Plan contract.

### Plant Details care cards

No change. Do not show target entities as pending tasks. A future target-aware card must explain why the issue is relevant and distinguish monitoring from an instruction to spray.

### Watering and fertilization entry

No change. The target catalog does not affect watering intensity, fertilizer items, application method, or saved fertilizer applications.

### Spraying entry

No change in this slice. The eventual minimal interaction should keep “Bạn đã phun gì?” or product entry optional, then optionally expose:

- `Mục đích`: phòng bệnh or xử lý dấu hiệu;
- `Vấn đề muốn xử lý`: a curated target or free-text fallback.

Selecting a target must not assert diagnosis and must not be required for quick logging. Advanced purpose, target, method, quantity, note, and product-label details remain optional. Foliar nutrition remains `fertilizing` with `applicationMethod: foliar`; it is not a pest or disease target.

### Care Guides

No change. The target documents compile as knowledge entities, not Care Guides or tasks. A future read-only target guide can be linked with “Hướng dẫn” or an information icon, but that navigation pattern is deferred.

### Activity timeline

No change. Existing records continue to show “Đã phun”. A later target-aware activity may show “Đã phun phòng phấn trắng” or “Đã phun xử lý bọ trĩ”, while a missing or unresolved target falls back to “Đã phun”.

### Mở rộng and management screens

No new management screen. The targets are curated content, not a user-editable pest list. Do not add “Danh sách sâu bệnh”, spray inventory, product-label management, weather preferences, or growing-context management to the MVP from this slice.

### Reminders and recommendation evaluation

No change. Target stage relevance does not create reminders. The existing engine still evaluates one Care Plan from species, stage, activity history, and missing-history behavior. Connecting targets before redefining recommendation scope would risk duplicate or misleading spraying recommendations.

## Spraying model decision

Continue with Option B from the broader model audit:

- keep one `spraying` activity type for plant protection;
- keep optional pest/disease targets under that flow;
- record foliar nutrition as `fertilizing` with `applicationMethod: foliar`.

Do not add `foliar_feeding`, `biological_treatment`, or target-specific activity types. Separate workflows, analytics, reminders, or safety requirements have not been demonstrated.

## UI impact summary

### No UI change required

| Screen                      | Current behavior                                | Proposed behavior | Required model field | MVP priority | Backward-compatible fallback |
| --------------------------- | ----------------------------------------------- | ----------------- | -------------------- | ------------ | ---------------------------- |
| Today                       | Existing Care Plans determine cards             | Unchanged         | None                 | Now          | Existing behavior            |
| Plant Detail                | Existing Care Plans and history determine cards | Unchanged         | None                 | Now          | Existing behavior            |
| Watering entry              | User selects watering details                   | Unchanged         | None                 | Now          | Existing behavior            |
| Fertilization entry         | User selects concrete fertilizer items          | Unchanged         | None                 | Now          | Existing behavior            |
| Spraying entry              | Generic quick logging                           | Unchanged         | None                 | Now          | “Đã phun”                    |
| Journal and Activity Detail | Generic spraying summary                        | Unchanged         | None                 | Now          | “Đã phun”                    |
| Reminder settings           | Care Plan schedules only                        | Unchanged         | None                 | Now          | Existing snapshots           |
| Mở rộng                     | No pest/disease management                      | Unchanged         | None                 | Now          | No new screen                |

### Small UI update

None in this slice.

### New component or flow required

None in this slice. A later optional target selector and read-only target guide require separate approval after their persistence and recommendation boundaries are specified.

### Deferred from MVP

| Screen               | Current behavior           | Possible later behavior                              | Required model field                                                | MVP priority | Backward-compatible fallback   |
| -------------------- | -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- | ------------ | ------------------------------ |
| Spraying entry       | Generic entry              | Optional grouped target selector with “Khác”         | Nullable target ID and name snapshot                                | Deferred     | Free text or no target         |
| Target guide         | No destination             | Read-only evidence, prevention, and escalation guide | Target ID and compiled body                                         | Deferred     | No link                        |
| Today / Plant Detail | Generic spraying Care Plan | Target-aware monitor/check card                      | Explicit target-aware Care Plan scope and reviewed evaluator inputs | Deferred     | Existing generic plan behavior |
| Timeline             | “Đã phun”                  | Purpose- and target-aware summary                    | Saved purpose and target snapshot                                   | Deferred     | “Đã phun”                      |

## Compatibility and migration

- Production Knowledge Base `1.0.0` remains byte-for-byte unchanged in this slice.
- Preview `1.1.0` adds required `pests` and `diseases` arrays. The preview-only consumer continues reading the original fields and safely ignores these new arrays.
- Before any `1.1.x` production publication, implement the explicit bundle adapter already tracked in `TODO.md`: accept `1.0.x` with missing target arrays as empty, accept supported `1.1.x`, and reject unsupported major versions.
- Existing activities containing only `activityType`, spraying without purpose or target, watering without intensity, fertilizing without item IDs, reminder preferences, and stage logic are not read or migrated by this slice.
- No SQLite or Supabase migration is required.
- Do not parse existing notes to infer a target or diagnosis.

## Safe implementation sequence

1. Add failing compiler and schema tests for `pest` and `disease`.
2. Add source schemas, normalized types, relationship validation, required-section validation, and deterministic serialization.
3. Author review-stage grape targets and a source record for the Vietnamese thrips material.
4. Generate preview `1.1.0`; do not publish or regenerate production `1.0.0`.
5. Later, after explicit approval, define target-aware Care Plan scope and the nullable activity target ID/name snapshot before changing UI or reminders.

## Explicit recommendation

Choose option 2: extend the current model with optional backward-compatible fields.

Add now: `pest` and `disease` Knowledge Base types; stable target IDs; `speciesIds`, `stageIds`, `warningSignIds`, optional `scientificName`, reviewed Markdown, status, version, and references; preview bundle `pests` and `diseases` arrays.

Defer: Care Plan target relationships, saved spray target fields, purpose-driven entry, target-aware evaluation, Warning Sign entities, product IDs and labels, weather risk, treatment schedules, diagnosis, inventory, and management screens.

No UI screens or stored data change now. This is the smallest safe foundation for target-aware spraying without making an unsupported recommendation or overcomplicating the MVP.
