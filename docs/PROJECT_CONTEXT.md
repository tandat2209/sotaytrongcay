# Project context

## Product vision

Sổ tay trồng cây is an intelligent gardening coach for beginners. It accompanies users through a plant's lifecycle, explains what to do today, and builds history automatically as guided work is completed.

Guidance is the primary value. Tracking is a low-effort outcome of following guidance, not the first decision a beginner must make.

Grapes are the first fully guided species. The product model supports other species and stage playbooks without changing the core experience.

## Problem statement

Beginners do not mainly lack a place to write notes. They lack confidence about:

- what to do today;
- why an action matters now;
- what to avoid during the current stage;
- what to prepare for next;
- whether the plant is ready to move forward.

Generic content ignores growth stage, recent history, local weather, and progress. A blank journal still leaves the user responsible for interpreting all of that information.

## Target user

The primary MVP user is a beginner growing one or a few grape plants at home. They want a successful outcome but have limited horticultural knowledge and do not want farm-management software.

Hobby gardeners and small growers remain future segments. MVP guidance quality should not be diluted to support every experience level or plant species.

## Desired outcomes

Users can:

- understand today's goal in plain Vietnamese;
- see a short prioritized list of recommended tasks;
- understand why each task matters and what to avoid;
- adapt simple care decisions to current weather;
- see progress toward the next growth stage;
- complete routine care without manually creating a journal entry;
- add notes or photos only when useful;
- review trustworthy history when they need it.

## Core journey

1. Create a grape plant and select its current stage.
2. Read the stage goal, current risks, and upcoming milestone.
3. Open Today to see reviewed recommended tasks adjusted by simple weather rules.
4. Open a task to understand what, why, what to avoid, and what to prepare.
5. Complete the task; the app creates a journal entry automatically.
6. Add optional notes/photos or continue without extra input.
7. Confirm stage completion when observable criteria are met.
8. Begin the next stage playbook.

Manual logging remains available through the FAB for unplanned work and observations.

## Product principles

- **Guide first:** the product proposes the next useful action before asking users to record anything.
- **Track automatically:** completed guided work creates history without duplicate input.
- **Teach progressively:** explain only the knowledge relevant to the current stage and task.
- **Explain why:** every recommendation includes a reason, not only an instruction.
- **Reduce decision fatigue:** prioritize a small number of tasks instead of presenting a complete care encyclopedia.
- **Beginner success:** optimize for confidence and safe progress, not data-entry completeness.
- **User confirms reality:** the app never advances a growth stage or claims a diagnosis without user confirmation.
- **Reviewed guidance:** MVP recommendations come from curated playbooks and deterministic rules, not generative AI.
- **Weather as context:** weather may delay, suppress, or prioritize guidance; it is not a separate product.
- **Manual escape hatch:** quick logging remains available for work outside the generated plan.
- **Knowledge separation:** curated guidance never becomes user-owned data.
- **User control:** users can edit history, dismiss tasks, change stages, and export or delete data.

## MVP capabilities

- Grape profiles with a current growth stage.
- One curated playbook for each supported grape stage.
- Stage goal, description, watering, fertilizers, recommended activities, avoid list, common problems, completion criteria, and next stage.
- Deterministic generation of a short daily recommended-task list.
- Simple weather rules for rain, spraying, heat, and soil-moisture checks.
- Task detail that explains what, why, what to avoid, and what to prepare.
- One-tap task completion that automatically creates a journal entry.
- Optional notes and photos after completion.
- Guidance-first Today and Plant Dashboard.
- Manual quick logging through the FAB.
- Plant Timeline and global Journal for automatic and manual history.
- One-time reminders and local notifications.

MVP does not generate advice with AI, diagnose disease, support every species, or create complex adaptive schedules.

## Capability rationale

| Capability | User value | MVP constraint |
| --- | --- | --- |
| Stage playbook | Makes guidance relevant to the plant's development | Curated grape content only |
| Recommended tasks | Converts knowledge into clear daily action | Small deterministic list |
| Explanation | Builds confidence and teaches progressively | One short reason per task |
| Avoid list | Prevents common beginner mistakes | Stage/task-specific only |
| Weather rules | Prevents obviously mistimed care | Reviewed rain/heat/spray rules only |
| Automatic journal | Removes duplicate tracking work | One entry per completed task |
| Completion criteria | Makes stage progress observable | User confirms advancement |
| Manual FAB | Captures unplanned work | Secondary to guided tasks |
| Journal | Preserves evidence and learning | History, not primary value |
| AI readiness | Avoids a later data-model rewrite | No AI feature in MVP |

## Conceptual data model

- A **Plant** references one **Plant Species** and one current **Growth Stage**.
- A **Stage Playbook** belongs to one species/stage and defines goal, guidance, risks, completion criteria, and next stage.
- A **Recommended Task Definition** belongs to a playbook and explains what, why, and applicable constraints.
- A **Recommended Task** is a user-specific task instance generated from a definition and context.
- A **Weather Rule** may prioritize, delay, suppress, or annotate a task with an explanation.
- Completing a task creates one **Journal Entry** in the same operation.
- A journal entry records its source: recommended task, reminder, or manual activity.
- Notes and photos may be attached during or after completion.
- A **Reminder** is scheduled future care; it is distinct from a recommendation.
- Stage progress is based on user-confirmed completion criteria, not inferred certainty.
- User data references stable Knowledge Base IDs but never owns curated content.

## Knowledge Base model

Each growth stage playbook contains:

- stage name;
- goal;
- description;
- recommended watering;
- recommended fertilizers;
- recommended activities;
- things to avoid;
- common problems;
- completion criteria;
- next stage.

Recommended activities reference reusable fertilizer, disease, pest, care-guide, and weather-rule content where relevant.

## Assumptions to validate

- Beginners prefer a small guided task list over a blank journal.
- A short explanation increases task confidence and completion.
- Automatic history feels helpful rather than surprising.
- Users can assess stage completion with observable criteria.
- Reviewed deterministic guidance is sufficient for MVP value.
- Weather can improve guidance with a small rule set.
- Users still need manual logging for unplanned care.

## Constraints and risks

- Incorrect guidance may harm plants; every rule needs source, reviewer, scope, and version.
- Over-generating tasks may create anxiety and notification fatigue.
- Stage selection may be wrong, making guidance irrelevant.
- Weather may be stale or location-inaccurate.
- Task completion does not prove the action was performed correctly.
- Automatic journal entries must be editable and clearly attributed.
- Guidance must not be presented as diagnosis or guaranteed outcome.
- Rich playbooks may expand MVP content work faster than engineering work.

## Candidate success metrics

- Percentage of activated plants with a selected growth stage.
- Daily recommended-task view rate.
- Recommended-task completion rate.
- Percentage of completed tasks that create a journal entry successfully.
- Percentage of users who understand why a task was recommended.
- Stage milestone completion rate.
- Week-four retention for beginner grape growers.
- Manual-entry rate compared with automatic-entry rate.
- Dismissed or repeatedly ignored task rate.

## Open questions

- Does the product name “Sổ tay trồng cây” still communicate a guidance-first coach?
- Which grape stages are essential for the first guided journey?
- How many recommended tasks per day avoid overload?
- Which completion criteria can beginners assess reliably?
- Which weather rules are safe enough for MVP?
- Should skipped tasks return tomorrow, be dismissed, or require a reason?
- How should users correct an initially wrong growth stage?
- Which sources and experts approve playbook content?
- Does a dedicated Journal tab remain frequent enough once tracking is automatic?
