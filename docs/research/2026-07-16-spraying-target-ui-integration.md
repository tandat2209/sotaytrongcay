# Spraying target UI integration impact

**Date:** 2026-07-16
**Status:** Accepted implementation scope
**Scope:** Optional primary pest/disease target on a user-saved spraying activity

## Outcome

Expose the curated grape pest/disease catalog as an optional single-selection field in spraying Care Entry. Save both the stable Knowledge Base target ID and the Vietnamese name shown at save time. Use the name snapshot in Journal, Plant Detail recent history, Today recent history, and Activity Detail.

The field records what the grower intended to address. It is not a diagnosis, proof that the issue was present, a treatment recommendation, or a trigger for cards and reminders. The minimum spraying path remains plant, time, and explicit “Lưu hoạt động”; target selection is optional.

Only target identity and Vietnamese title are used. Review-stage risk, stage, prevention, and treatment content is not shown or executed by this flow. Targets are filtered by species, not stage, so an unapproved monitoring-stage relationship cannot become UI eligibility.

## Model-change report

| Field or concept          | Current model                                                                     | Proposed model                                                              | Change type                   | Reason                                                                             | UI impact                                | Engine impact | Data migration             |
| ------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------- | ------------- | -------------------------- |
| Target catalog read       | Preview bundle contains `pests` and `diseases`, but the app consumer ignores them | `listSprayTargets(speciesId)` returns stable ID, Vietnamese title, and kind | Backward-compatible extension | Populate the optional selector without duplicating Knowledge Base names in UI copy | Spraying entry                           | None          | None                       |
| `sprayTargetId`           | No structured target on Care Activity                                             | Nullable stable `pest.*` or `disease.*` ID                                  | Backward-compatible extension | Retain curated identity for later lookup and reporting                             | Entry and edit flows                     | None          | Add nullable SQLite column |
| `sprayTargetNameSnapshot` | No structured target display                                                      | Nullable immutable Vietnamese name snapshot paired with the ID              | Backward-compatible extension | Keep old history readable after bundle removal or wording changes                  | Journal, recent history, Activity Detail | None          | Add nullable SQLite column |
| Target selection          | Generic spraying form                                                             | Optional one-primary-target radio-chip group                                | Small UI update               | Keep quick logging simple while making the common target explicit                  | Care Entry                               | None          | None                       |

Both saved fields are present together or absent together. They are valid only for `activityType: spraying`. Existing rows remain null; notes are never parsed or backfilled.

One primary target is the MVP boundary. A single spraying event may have broader intent, which can remain in notes. Multi-target history would require a child relationship table, selection behavior, summary rules, and migration of the current nullable pair; defer it until users demonstrate that need.

## Field impact answers

### `sprayTargetId`

- **Screens reading it:** spraying Care Entry when editing; otherwise persistence and validation only.
- **Shown directly:** no; the snapshot name is shown.
- **Recommendation cards:** no effect on whether a card appears or its state.
- **Quick entry:** selecting a target sets it in the unsaved draft; nothing is saved until explicit Save.
- **Activity record:** saved as nullable target identity.
- **Reminder reconciliation:** unchanged; latest spraying history remains matched by activity type only.
- **New UI:** one optional radio-chip group, with no new icon required.
- **Older bundles:** the target list falls back to empty if target arrays are absent.
- **Older activity records:** remain valid with no target.

### `sprayTargetNameSnapshot`

- **Screens reading it:** Care Entry edit, Journal, Today recent history, Plant Detail recent journal, and Activity Detail.
- **Shown directly:** yes, as user-history context.
- **Recommendation, quick-entry eligibility, and reminders:** no effect.
- **Saved activity:** immutable snapshot; later Knowledge Base title changes do not rewrite it.
- **New UI:** optional secondary summary text and an Activity Detail row.
- **Older bundles and activities:** fallback is the existing generic “Phun thuốc” or “Đã phun thuốc”.

## Product-surface review

### Today recommendation cards

No card-state or wording change. Opening spraying Care Entry from Today shows the same optional target selector as manual entry. Saving still requires explicit confirmation. The selected target does not affect future recommendation eligibility or reminder reconciliation.

### Plant Details care cards

No care-card change. The plant-scoped Quick Care spraying sheet shows the selector. Recent saved spraying may show the target snapshot beneath “Phun thuốc”.

### Watering and fertilization entry

No change. Target fields are rejected for non-spraying activities. Watering intensity and fertilizer applications keep their current contracts.

### Spraying entry

Show:

```text
Vấn đề muốn xử lý (không bắt buộc)

Chọn để ghi lại mục đích của lần phun, không phải chẩn đoán.

[ Bệnh phấn trắng trên nho ] [ Bọ trĩ hại nho ]
```

The group is single-select and can be cleared by tapping the selected chip. Empty catalog state hides the section rather than blocking logging. No product, purpose, dosage, method, quantity, or safety-label field becomes required.

### Care Guides

No change. The selector does not link to or display the review-stage target body. Adding read-only target guides remains separate work.

### Activity timeline and detail

- Legacy spray: “Phun thuốc”.
- New targeted spray: “Phun thuốc” with “Bọ trĩ hại nho” as secondary context.
- Activity Detail adds “Vấn đề muốn xử lý” only when the snapshot exists.

Do not render “đã xử lý thành công”, “đã trị”, or “đã chẩn đoán”. Purpose remains unknown until a separate optional purpose field is implemented.

### Mở rộng and management

No new management screen. Targets are curated Knowledge Base entities, not a user-editable catalog. Spray product inventory and pest/disease management remain deferred.

## UI impact summary

### No UI change required

| Screen                    | Current behavior                  | Proposed behavior | Required model field | MVP priority | Backward-compatible fallback |
| ------------------------- | --------------------------------- | ----------------- | -------------------- | ------------ | ---------------------------- |
| Today recommendation card | Generic spraying action           | Unchanged         | None                 | Now          | Existing behavior            |
| Plant Detail care card    | Generic spraying guidance/history | Unchanged         | None                 | Now          | Existing behavior            |
| Watering entry            | Watering-only fields              | Unchanged         | None                 | Now          | Existing behavior            |
| Fertilization entry       | Fertilizer application fields     | Unchanged         | None                 | Now          | Existing behavior            |
| Reminder settings         | Activity-type schedule            | Unchanged         | None                 | Now          | Existing snapshots           |
| Mở rộng                   | No target management              | Unchanged         | None                 | Now          | No management screen         |

### Small UI update

| Screen                      | Current behavior            | Proposed behavior                           | Required model field              | MVP priority | Backward-compatible fallback    |
| --------------------------- | --------------------------- | ------------------------------------------- | --------------------------------- | ------------ | ------------------------------- |
| Spraying Care Entry         | Generic optional notes      | Optional single target chips                | Target catalog, ID, name snapshot | Now          | Hide selector if catalog absent |
| Journal                     | “Phun thuốc”                | Add target snapshot as secondary text       | Name snapshot                     | Now          | “Phun thuốc”                    |
| Plant Detail recent journal | “Phun thuốc”                | Add target snapshot as secondary text       | Name snapshot                     | Now          | “Phun thuốc”                    |
| Today recent history        | Generic saved-spray wording | Add target snapshot without treatment claim | Name snapshot                     | Now          | Existing wording                |
| Activity Detail             | Origin and notes only       | Conditional target row                      | Name snapshot                     | Now          | Omit row                        |

### New component or flow required

One reusable `SprayTargetPicker` component inside the existing Care Entry sheet. No new route, modal, or management screen.

### Deferred from MVP

- Multiple targets per spraying activity.
- Free-text target separate from notes.
- Spray purpose, product, method, quantity, and product-label database.
- Target detail navigation and Warning Sign flows.
- Target-aware recommendation states, schedules, weather rules, and reminders.
- Diagnosis or automated issue detection.

## Migration and compatibility

1. Add SQLite migration V15 with nullable `spray_target_id` and `spray_target_name_snapshot` columns.
2. Do not update existing rows or parse notes.
3. Repository reads missing values as null and writes both fields together.
4. Zod accepts legacy activities where both fields are absent and rejects partial pairs or target fields on watering/fertilizing.
5. Editing a legacy spray starts with no target; saving without selection remains valid.
6. Bundles without `pests` and `diseases` produce an empty selector and do not prevent activity history from loading.
7. Existing reminder preferences and stage-based recommendation logic remain unchanged.

No destructive migration, Supabase backfill, new icons, or reminder reconciliation change is required.

## Explicit recommendation

Continue with option 2: extend the current model with optional backward-compatible fields.

Add now: `sprayTargetId`, `sprayTargetNameSnapshot`, target catalog access, optional spraying target chips, and snapshot-based history display.

Defer all target-aware guidance and treatment behavior. This keeps the UI useful for logging while preserving the boundary between user intent, curated knowledge, and diagnosis.
