# Project context

## Product vision

Sổ tay trồng cây is a plant-care companion that helps users keep reliable care history and understand what matters for the plant's current growth stage.

Tracking watering, fertilizing, and spraying is the core utility. Photo journal entries preserve other work and observations. Stage guidance adds concise tips, warnings, and milestones.

Grapes are the first supported species. Other species can provide their own stages and tips without changing the tracking model.

## Problem statement

Gardeners often cannot answer:

- when the plant was last watered, fertilized, or sprayed;
- which product, amount, or method was used;
- what care is due next;
- which stage-specific mistakes should be avoided;
- whether a visible condition is new or recurring.

A blank journal is too much work, while a guidance-heavy coach can overcomplicate simple care. The product should make important tracking fast and keep guidance contextual.

## Target user

The primary MVP user grows one or a few grape plants at home and wants a simple care record with practical stage context.

They may be a beginner, but the product should not require them to follow or complete every tip.

## Desired outcomes

Users can:

- record watering or fertilizing in seconds;
- see the last important care for each plant;
- remember products, amounts, methods, notes, and photos;
- receive reminders for future care;
- understand concise tips for the current stage;
- see warnings and the next milestone without managing extra tasks;
- review one plant's timeline or all activity in Journal.

## Core journey

1. Create a grape plant and select its current stage.
2. Open Plant Detail to see last care, next reminder, stage tips, warnings, and milestone.
3. Use a button in “Việc cần làm hôm nay” to enter performed care.
4. Record the performed activity with optional details.
5. Review the saved activity in Plant Timeline and Journal.
6. Create a reminder when future care should be scheduled.

## Product principles

- **Track essential care:** watering, fertilizing, and spraying are first-class activity history.
- **Journal the rest:** pruning, observations, and other updates belong in photo-and-note journal entries.
- **Keep logging fast:** the minimum path is plant, activity, time, and Save.
- **Guide in context:** tips live with the plant and stage instead of becoming a task list.
- **Do not manufacture work:** informational tips have no completion state, reminder, or journal entry.
- **Prompt, then confirm:** a Today care button may prefill entry, but the user saves what actually happened.
- **Explain safely:** advice comes from reviewed Knowledge Base content and avoids unsupported certainty.
- **Weather as context:** weather may adjust care suggestions but never fabricate measurements or actions.
- **User-controlled history:** activities remain editable, exportable, and deletable.

## MVP capabilities

- Grape plant profiles with current growth stage.
- Contextual care entry for watering, fertilizing, and spraying.
- “Thêm nhật ký” for plant photos and notes, including pruning or observations, with an optional stage change in the same save.
- Optional structured details for products, NPK, amounts, dosage, methods, notes, and photos.
- Plant Dashboard with last watering, fertilizing, spraying, next reminder, weather, stage, and recent journal entries.
- Stage tips, things to avoid, warning signs, and upcoming milestone inside Plant Detail.
- Contextual care prompts under “Ưu tiên hôm nay”, based on stage and recent history.
- Today evaluates applicable care definitions as recommended, not recommended, or unavailable; it preserves negative explanations so users can see why care is not suggested.
- Today care prompts deep-link into a prefilled care form; they are not persistent tasks.
- Plant Timeline and global Journal.
- One-time reminders and local notifications.

## Capability rationale

| Capability | User value | MVP constraint |
| --- | --- | --- |
| Quick care tracking | Preserves reliable history | Minimum required fields only |
| Plant Dashboard | Answers when care last happened | Summary, not analytics |
| Stage tips | Adds relevant learning | Informational and non-trackable |
| Today care prompts | Surfaces likely next care | User must confirm by saving activity |
| Weather context | Avoids obvious timing mistakes | Reviewed rules and freshness labels |
| Reminders | Supports planned future care | One-time scheduling first |
| Journal | Makes activity history searchable | No knowledge articles mixed into history |

## Conceptual data model

- A **Plant** references one **Plant Species** and one current **Growth Stage**.
- A **Stage Guide** supplies review-stage context: objective, observations, duration, knowledge topics, and sources. It never creates reminders, tasks, automatic transitions, or executable rules.
- A **Care Plan** owns stage-scoped watering, fertilizing, or spraying guidance and its deterministic suggestion fields: title, goal, optional growing-method frequency, recommended inputs, notes, species/stage scope, eligibility, missing-history policy, and priority. MVP permits one applicable plan per scope.
- A **Care Guide** contains generic informational techniques such as training or pruning and does not create tracked care recommendations.
- Review-stage content remains informational and creates no history.
- A **Care Activity** records performed watering, fertilizing, or spraying.
- A **Plant Update** records a dated photo and optional note for pruning, observations, growth, or other changes. It may confirm a new growth stage.
- Saving either record adds it to the plant Timeline and global Journal.
- A care record may store its origin as Today, reminder, or manual entry.
- A **Reminder** schedules future care and is distinct from suggestions and history.
- Weather Rules may prioritize, delay, suppress, or annotate a suggestion.
- User data references stable Knowledge Base IDs but never owns curated content.

## Knowledge Base model

Each growth-stage guide contains:

- stage name, description, and goal;
- watering and fertilizer context;
- stage tips;
- things to avoid;
- common problems and warning signs;
- milestone and next stage;
- references and review metadata.

Care Plans exist only for trackable watering, fertilizing, and spraying. General techniques and pruning guidance remain informational tips or guides.

## Assumptions to validate

- Watering and fertilizing history provide the strongest repeat value.
- Users want stage tips but do not want to manage them as tasks.
- Today care prompts are useful when they open a prefilled form rather than auto-recording activity.
- Optional details do not slow the minimum logging path.
- One-time reminders are sufficient for MVP.
- Weather can improve timing with a small rule set.

## Constraints and risks

- Product and dosage guidance may harm plants without expert review and complete context.
- A suggestion must not imply that an activity was performed.
- Stage tips can overwhelm Plant Detail if not concise.
- Fabricated sensor or soil-moisture values would damage trust.
- Weather may be stale or location-inaccurate.
- Rich activity forms may slow routine logging.
- Disease content must not become unsupported diagnosis.

## Candidate success metrics

- Time to record watering or fertilizing.
- Percentage of activities saved with correct plant and time.
- Weekly active care-recording rate.
- Plant Dashboard usage before new care entry.
- Reminder creation and completion rate.
- Timeline and Journal retrieval success.
- Stage-tip comprehension without task-completion confusion.
- Suggestion-to-saved-activity conversion rate.

## Open questions

- Which activity fields are essential for watering and fertilizing?
- Should suggestions appear on Today, Plant Detail, or both?
- Which stage tips are useful enough to show by default?
- How many tips can Plant Detail show without clutter?
- Which weather rules are safe enough for MVP?
- Should reminders support recurrence after MVP?
- Does Journal remain frequent enough for a primary tab?
