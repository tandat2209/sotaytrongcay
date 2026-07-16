# Knowledge model and UI impact audit

**Date:** 2026-07-16
**Status:** Accepted direction; implementation pending
**Scope:** Care Plans, recommendations, watering, fertilizing, spraying, reminders, care entry, and saved activity compatibility

## Outcome

Extend the current model with optional backward-compatible fields. Do not make a breaking Knowledge Base revision before expanding the reviewed content.

The smallest useful extension is to:

- distinguish an actionable recommendation from a condition check;
- preserve individual fertilizer items and optionally suggest their application method;
- keep plant-protection spraying as one activity type while recording optional purpose, product name, and target text;
- represent foliar nutrition as fertilizing with `applicationMethod: foliar`;
- preserve every existing Knowledge Base bundle, activity record, fertilizer application, and reminder snapshot without destructive migration.

The first follow-up should be a narrow, source-backed, review-stage spraying Care Plan. It must not name a commercial product, prescribe a dosage, or enter the production bundle without qualified review.

## Current model

### Care Plans

The `care_plan` schema currently supports:

- `watering`, `fertilizing`, and `spraying` activity types;
- elapsed days since the latest matching activity;
- `suggest` or `withhold` behavior when history is missing;
- optional ground/container frequency;
- optional structured fertilizer suggestions;
- optional notes.

It cannot explicitly say that elapsed time should trigger an inspection rather than the activity itself. The evaluator therefore maps a reached threshold to `recommended`, while Today gives a recommendation card a direct Care Entry action.

### Watering

New watering records require one stable intensity: `light`, `moderate`, `deep`, or `rain`. Legacy rows may have no intensity and remain displayable without inference.

Do not add `recommendedIntensity` now. Stage and elapsed history alone do not justify preselecting an intensity, and `rain` is a recorded event rather than a recommendation.

### Fertilizing

Fertilizing is already item-based:

- one Care Activity may contain several Fertilizer Applications;
- each application snapshots a concrete item name and optional group;
- application method, amount/unit, and notes are optional;
- reviewed Care Plan suggestions have stable IDs and create selectable quick-add items;
- `foliar` is already a valid fertilizing application method.

`recommendedInputs` is the source for reviewed individual quick-add suggestions. Recommendation groups organize the items but are not selectable values, default selections, or a replacement for the private fertilizer catalog.

### Spraying

Spraying is currently a generic Care Activity with only the common activity note. The documented optional spraying details are not implemented. Existing records therefore cannot reliably distinguish prevention, treatment, product, target issue, or foliar nutrition.

### Recommendation and reminder behavior

The evaluator currently returns `recommended`, `not_recommended`, or `unavailable`. Schedule resolution separately returns `due`, `overdue`, or `upcoming` from a fixed interval.

Do not add a persisted five-state recommendation model yet. `monitor` and `withhold` require reviewed weather, symptom, observation, or risk inputs that the current engine does not have.

## Proposed optional fields

### Authored Care Plan

```yaml
recommendation_mode: action | check

check_before_acting:
  prompt: string
  act_when: string
  skip_when: string # optional

recommended_inputs:
  - group: string
    suggestions:
      - id: string
        name: string
        fertilizer_group: organic | npk | single | supplement | other
        application_method: root | drench | foliar | topdress # optional

recommended_spray_purpose: prevention | treatment # optional
```

Runtime TypeScript uses camelCase names. All fields are optional. A missing `recommendationMode` has the backward-compatible value `action`.

### Saved Care Activity

```ts
sprayProductName: string | null;
sprayPurpose: "prevention" | "treatment" | null;
sprayTargetName: string | null;
```

These fields are optional snapshots of what the user recorded. They are not curated product profiles, diagnoses, or proof that a target issue was present.

## Model-change report

| Field or concept | Current model | Proposed model | Change type | Reason | UI impact | Engine impact | Data migration |
| ---------------- | ------------- | -------------- | ----------- | ------ | --------- | ------------- | -------------- |
| Recommendation mode | Every eligible result looks actionable | Optional `action` or `check` | Backward-compatible extension | Prevent condition-based watering from looking guaranteed | Today, Plant Detail, schedule settings, notification copy | Changes presentation and destination, not eligibility | None |
| Check-before-acting guidance | Inspection detail is buried in goal or notes | Optional prompt, act condition, and skip condition | Backward-compatible extension | Give the UI explicit inspection text | Recommendation card/detail | No new facts or rules | None |
| Suggested fertilizer method | Item ID, name, and group only | Optional existing application method | Backward-compatible extension | Represent foliar feeding in fertilization | Care Entry and Stage Playbook | No timing impact | None |
| Recommended spray purpose | No spraying recommendation metadata | Optional prevention/treatment value | Backward-compatible extension | Allow purpose-driven prefill | Care Entry and recommendation detail | No timing impact | None |
| Saved spraying details | Generic activity and note | Optional product name, purpose, and target name | Backward-compatible persistence extension | Improve entry and history without making fields mandatory | Spraying entry, detail, timeline | No recommendation or reminder effect | Nullable SQLite columns |
| Full recommendation states | Three evaluator statuses plus schedule status | Defer | Deferred | Real inputs do not yet support `monitor` or `withhold` | None now | Avoid invented conclusions | None |
| New spraying activity types | One `spraying` type | Keep one type | No change | Separate workflows are not justified for MVP | Progressive optional fields in the existing flow | Existing history remains compatible | None |

## Product-surface impact

### Today recommendation cards

An eligible `action` plan may show “Đến lúc thực hiện”. An eligible `check` plan must show “Nên kiểm tra”, explain what to inspect, and keep recording as a separate explicit action.

A check card must never imply that elapsed time proves watering is needed. The primary interaction opens or expands inspection guidance. A secondary entry action may open Care Entry, but saving remains required.

### Plant Detail care cards

Cards should show:

- an action- or check-appropriate status;
- the latest saved matching activity;
- why the recommendation appears;
- what the grower should inspect when `checkBeforeActing` exists;
- the existing read-only goal, frequency, inputs, and notes.

Keep `not_recommended` and unavailable states informational. Do not give every Care Plan pending-task styling.

### Watering entry

Keep the current four explicit choices. Condition-check metadata does not select an intensity. The grower chooses the intensity and explicitly saves the activity.

Do not add small/large rain codes or exact-volume requirements in this work.

### Fertilization entry

Keep individual reviewed suggestion chips. An optional authored application method may prefill an editable application draft. No item or method is saved until the parent activity is explicitly saved.

Do not add recommended quantities without reviewed assumptions and safety evidence.

### Spraying entry

Keep the minimum save path fast: plant, time, and explicit Save. Progressively disclose:

1. optional purpose chips for prevention or treatment;
2. optional product name;
3. optional target/problem text;
4. the existing general note.

Do not require a target, diagnosis, product database, dosage, or product-label fields. Do not add a spray inventory or pest/disease management screen in MVP.

### Care Guides

Generic techniques moved out of a Care Plan appear under the existing Stage Playbook “Hướng dẫn tham khảo” section, reached through “Hướng dẫn chi tiết”. They never become Today cards, reminders, completed activities, or history.

### Activity history

Fallback summaries remain valid:

- old watering: “Đã tưới” plus “Chưa ghi mức tưới” in detail;
- new watering: “Đã tưới đẫm”;
- old fertilizing: “Đã bón phân”;
- new fertilizing: “Đã bón Kali sunfat + NPK 12-12-17”;
- foliar fertilizing: “Đã bón Canxi clorua qua lá”;
- old spraying: “Đã phun”;
- new spraying: “Đã phun phòng sương mai”.

Never parse old notes to infer purpose, product, target, intensity, or activity type.

### More and management

The existing fertilizer-management screen remains sufficient. Do not add spray inventory, pest/disease management, growing-context management, or weather preferences until users need to create, edit, or reuse those entities.

## Recommendation presentation

Derive the minimum useful presentation without persisting recommendation instances:

| Presentation | Calculation | Today | Notification | Manual care entry |
| ------------ | ----------- | ----- | ------------ | ----------------- |
| `due` | Eligible and mode is `action` | Show actionable card | Allowed when enabled | Always available |
| `check` | Eligible and mode is `check` | Show inspection card | Allowed with “Kiểm tra…” wording | Always available |
| `not_due` | Latest activity is below the threshold | Hide | None | Always available |
| `unavailable` | Required context is missing or invalid | Hide; explain on Plant Detail | None | Always available |
| `not_applicable` | No plan applies to species/stage | Hide | Cancel or deactivate plan notification | Always available |

If weather is unavailable, omit weather reasoning. Never infer favorable or unfavorable weather. Future rules that require missing weather should return unavailable or neutral rather than `due` or `withhold`.

## Spraying decision

Use a combination of these two boundaries:

- keep one `spraying` activity type for plant-protection spraying, with optional purpose, product name, and target name;
- record foliar nutrition as `fertilizing` with `applicationMethod: foliar`.

Do not introduce `foliar_feeding`, `biological_treatment`, or other new activity types without demonstrated separate workflows, safety requirements, analytics, or reminder behavior.

Existing spraying records must not be reclassified. Their notes do not provide reliable migration evidence.

## Compatibility and migration

### Knowledge bundles

- Bump the bundle schema from `1.0.0` to `1.1.0` when the optional fields ship.
- Accept both `1.0.x` and `1.1.x` through an explicit bundle adapter.
- Default omitted `recommendationMode` to `action`.
- Omit unavailable optional sections.
- Preserve stable document and fertilizer IDs.
- Bump the minor version of each Care Plan whose semantics change.
- Keep review-stage content out of the production bundle.

### User data

Add only nullable spraying columns in a forward SQLite migration. Do not backfill them. Existing watering, fertilizing, spraying, reminder, and stage-history rows remain unchanged.

Reconcile pending notifications once after mode-aware notification behavior ships so a check plan uses inspection wording. Preserve notification preferences and schedule snapshots.

## Delivery sequence

### Phase 1 — content and review

1. Author one narrow, source-backed, purpose-led spraying Care Plan at `review` status.
2. Audit frequency display, executable interval, and eligibility contradictions.
3. Move generic or event-specific material into Care Guides where it does not represent trackable care.
4. Obtain qualified Vietnamese grape-growing review before approval.

### Phase 2 — optional fields and compatibility

1. Add optional Care Plan fields and compiler validation.
2. Add the `1.0.x`/`1.1.x` bundle adapter.
3. Add optional fertilizer suggestion application method.
4. Add nullable spraying activity fields and migration.
5. Add progressive spraying entry and compatible activity summaries.

### Phase 3 — mode-aware recommendation UI

1. Add action/check presentation to Today and Plant Detail.
2. Update schedule settings and notification wording.
3. Ensure a check recommendation opens inspection guidance and does not auto-record care.

### Deferred

- full five-state recommendation model;
- recommended watering intensity;
- event-based or one-time schedules;
- live weather and disease-risk rules;
- spray product inventory and stable target issue IDs;
- dosage or product-label databases;
- automated diagnosis;
- new spraying-related activity types.
