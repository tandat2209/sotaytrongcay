# Project context

## Summary

Sổ tay trồng cây is a mobile gardening journal. It helps users record care, review plant history, and remember upcoming work. Grapes are the initial focus, but the product model supports other plants.

## Problem statement

Home growers often cannot connect three kinds of information: what a plant is, what happened to it, and what should happen next. Fragmented history makes generic advice hard to apply to a specific plant.

## Assumed target users

These groups require validation:

1. New home grape growers who need simple recording and reminders.
2. Hobby gardeners who track several individual plants.
3. Small growers who may eventually track groups or growing areas.

The MVP must select one primary group before detailed implementation.

## Desired outcomes

Users can:

- save an entry quickly while in the garden;
- answer “What did I last do for this plant?”;
- see plant changes through notes and photos;
- know which care task is due next;
- use previous history to improve future care.

## Core journey

1. Create the first plant.
2. Record care or an observation.
3. Review the entry in the plant timeline.
4. Create the next reminder.
5. Complete the reminder and optionally add it to the journal.

## Product principles

- **Garden-first entry:** the primary action must be fast and mobile-friendly.
- **History is the record:** preserve user-entered facts without presenting unsupported diagnosis.
- **Useful with little setup:** users can record before configuring advanced details.
- **Contextual guidance:** future advice must distinguish reference knowledge from garden facts.
- **User-controlled data:** support correction, export, and deletion before production release.

## Conceptual data model

- A user manages one or more **Plants**.
- A **Journal Entry** belongs to a plant.
- An entry records **Care**, an **Observation**, or both.
- A **Reminder** schedules future care for a plant.
- Completed reminders may create journal entries without duplicate input.
- Future versions may group plants into gardens or growing areas.

## Assumptions to validate

- Users will record consistently when entry is fast enough.
- Photos are valuable evidence of plant development.
- Reminders improve care consistency.
- Some users need individual plants; others need groups.
- Care terminology varies by species, climate, and growing method.

## Constraints and risks

- Incorrect advice may harm plants.
- Photos and garden location can be private data.
- Excessive form fields will reduce recording frequency.
- Garden connectivity may be unreliable.
- A grape-specific model could block future plant support.

## Candidate success metrics

- First-entry completion rate.
- Median time to save an entry.
- Number of active journal weeks per season.
- Reminder completion rate.
- Timeline review before a new entry.

## Open questions

- Which user group is primary for MVP?
- Is an individual plant the only MVP tracking unit?
- Does MVP provide guidance or only journaling and reminders?
- Is full offline first-launch required?
- Do users need shared care or collaboration?
- Which plant metadata matters in MVP?
- Which export formats are required?
