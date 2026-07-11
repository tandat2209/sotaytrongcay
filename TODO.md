# Work backlog

Prioritize guidance quality and beginner comprehension before implementation volume.

## Product validation

- [ ] Interview 5–8 beginner grape growers about daily care decisions and uncertainty.
- [ ] Validate the minimum grape growth stages for the first guided journey.
- [ ] Validate the goal, avoid list, common problems, and completion criteria for each MVP stage.
- [ ] Test whether beginners can assess stage completion without expert help.
- [ ] Validate the safe maximum number of recommended tasks per day.
- [ ] Test whether users understand why each task was recommended.
- [ ] Validate skip, dismiss, and resurface behavior for incomplete tasks.
- [ ] Validate weather rules for rain, spraying, heat, and soil-moisture checks.
- [ ] Validate that automatic journal creation feels expected and controllable.
- [ ] Confirm the global Journal remains a frequent destination after tracking becomes automatic.

## MVP content

- [ ] Define the reviewed grape stage sequence.
- [ ] Write one complete playbook for each supported stage.
- [ ] Add source, reviewer, version, locale, and review-date metadata.
- [ ] Define reusable watering, fertilizer, disease, pest, and weather-rule references.
- [ ] Review every instruction for unsafe certainty or diagnosis language.
- [ ] Create Vietnamese user-facing copy for goals, reasons, avoid lists, milestones, and task completion.

## MVP UX

- [ ] Prototype guidance-first Today with weather, stage, tasks, recent completions, and progress.
- [ ] Prototype the guidance-first Plant Dashboard and secondary Timeline.
- [ ] Prototype Task Guidance with what, why, avoid, and prepare-next content.
- [ ] Prototype one-tap completion, automatic journal creation, and optional details.
- [ ] Preserve the global FAB for manual care and observations.
- [ ] Test the four-tab shell and reminder management without a Reminder tab.
- [ ] Verify all loading, empty, error, stale-weather, and offline states.
- [ ] Define guidance and task-generation success metrics.

## Engineering

- [x] Define the feature-first, local-first architecture and Supabase sync strategy.
- [ ] Update the architecture for playbooks, recommendation rules, task instances, and automatic journal transactions.
- [ ] Bootstrap strict TypeScript, quality gates, and test infrastructure.
- [ ] Add the schema-validated Markdown Knowledge Repository.
- [ ] Build plants with species-defined growth stages and stage history.
- [ ] Build the deterministic Recommendation Engine with explainable reasons.
- [ ] Build weather-rule evaluation with freshness and safe fallback behavior.
- [ ] Build atomic task completion and attributed journal creation.
- [ ] Add optional completion notes/photos and manual quick logging.
- [ ] Add reminders, local notifications, and offline synchronization.
- [ ] Verify backup, restore, export, deletion, and content-version migration.

## Future

- [ ] Evaluate guidance for additional plant species.
- [ ] Evaluate AI personalization only after deterministic guidance proves useful.
- [ ] Evaluate diagnostics with suitable experts, data, and safeguards.
- [ ] Evaluate collaboration, analytics, premium features, and connected devices.

## Completed

- [x] Create project context and domain vocabulary.
- [x] Define mobile navigation and screen states.
- [x] Define technical architecture and engineering standards.
- [x] Separate user data from the Knowledge Base.
- [x] Define the complete Knowledge Base domain, authoring, rule, and RAG architecture.
- [x] Reposition the product around guidance-first value.
