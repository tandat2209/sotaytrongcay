# Work backlog

Prioritize care-tracking usefulness and entry speed before expanding guidance.

## Product validation

- [ ] Interview 5–8 grape growers about watering and fertilizing records.
- [ ] Identify the minimum fields for watering, fertilizing, and spraying.
- [ ] Test whether users can find last care and next reminder from Plant Detail.
- [ ] Validate which stage tips are useful without becoming tasks.
- [ ] Validate care buttons inside “Việc cần làm hôm nay”.
- [ ] Validate weather rules for watering, fertilizing, and spraying timing.
- [ ] Confirm the global Journal remains a frequent destination.

## MVP content

- [x] Define the canonical grape stage sequence in the review-ready pilot.
- [ ] Write concise tips, avoid text, warning signs, and milestones for each supported stage.
- [ ] Define additional reviewed care recommendation rules only for trackable activities.
- [ ] Add source, reviewer, version, locale, and review-date metadata.
- [ ] Review every product, dosage, and weather claim for unsafe certainty.
- [ ] Obtain qualified Vietnamese grape-growing review for the “Nuôi thân” pilot.

## MVP UX

- [x] Prototype Plant Detail with last care, three care summaries, stage identity, review-guidance availability state, and weather context.
- [ ] Prototype fast watering and fertilizing entry flows.
- [ ] Prototype Today care buttons that open prefilled care entry after recommendation behavior is approved.
- [ ] Remove standalone Task Guidance and guided-completion flows.
- [ ] Add “Thêm nhật ký” with optional stage change to Today and Plant Detail.
- [ ] Remove the global FAB and Quick Action menu.
- [ ] Add Journal source labels and filters.
- [ ] Verify loading, empty, error, stale-weather, and offline states.
- [ ] Add plant photo (`photoUri`) to Today priority cards when the Plant model supports user-captured images.
- [ ] Show linked Care Guide Markdown instructions in Today priority cards after reviewed UX and content scope.

## Engineering

- [x] Define the feature-first, local-first architecture and Supabase sync strategy.
- [x] Update architecture for derived care suggestions and three tracked care activities.
- [x] Bootstrap strict TypeScript, quality gates, and test infrastructure.
- [ ] Add the schema-validated Markdown Knowledge Repository.
- [x] Build first-slice plants with species-defined stages and a truthful pending-guidance state.
- [x] Build first-slice manual watering entry and activity history.
- [x] Build first-slice Plant Detail recent-watering summary and global Journal/Activity Detail views.
- [x] Deliver current-data Plant Detail slice: three care types summarised and recordable, stage identity, review-guidance text, weather context, recent care history, activity detail navigation, and 'Hướng dẫn chi tiết' link to stage playbook.
- [x] Extend the first slice with fertilizing, spraying, and full Plant Dashboard care summaries.
- [ ] Add plant editing and archive flows.
- [ ] Add photo-and-note journal entries with user-confirmed stage history and plant photos.
- [ ] Add reminders and a complete mixed-event Timeline.
- [ ] Add type-specific fertilizer and spraying details after reviewed field contracts exist.
- [x] Add approved stage guidance and a guide reader: StagePlaybookScreen + app/plants/[id]/guide route with stageId-param forward browsing.
- [ ] Add a weather provider and local cache; weather sections currently show the truthful unavailable state.
- [x] Build the first deterministic watering suggestion without persistent task instances, including transparent positive and negative Today evaluations.
- [ ] Obtain reviewed guide instructions before promoting migrated grape recommendation guides beyond `review`.
- [ ] Define differentiated recommendation priorities only after reviewed product ordering policy exists.
- [ ] Extend reviewed deterministic care suggestions to additional stages and care types.
- [ ] Add offline synchronization.
- [ ] Verify backup, restore, export, deletion, and content-version migration.

## Future

- [ ] Evaluate recurring care schedules.
- [ ] Evaluate guidance for additional plant species.
- [ ] Evaluate AI personalization only after deterministic suggestions prove useful.
- [ ] Evaluate diagnostics, collaboration, analytics, and connected devices.

## Completed

- [x] Create project context and canonical vocabulary.
- [x] Define mobile navigation and design guidelines.
- [x] Define technical and Knowledge Base architecture.
- [x] Separate user data from curated knowledge.
- [x] Distinguish trackable care from informational stage tips.
- [x] Review mockups 01–14 against the current product and Knowledge Base contract.
- [x] Author a sourced "Nuôi thân" grape Knowledge Base pilot with stable IDs and schemas.
- [x] Remove reminder-template and task/transition behavior from the review-stage grape playbook contract.
- [x] Align Knowledge Base documentation ownership and precedence with schemas and accepted product decisions.
- [x] Surface stage playbook content inline on Plant Detail (objective, knowledge topics, exit criteria) with 'NỘI DUNG CHỜ DUYỆT' label.
- [x] Implement StagePlaybookScreen as a general-purpose, stage-focused guide reader (not plant-specific); reachable from Plant Detail via 'Hướng dẫn chi tiết' CTA; supports forward browsing through stages via stageId query param.
- [x] Add stage-specific icons (12 stages mapped to Ionicons) consistently across Plant Detail, Plant List, and Stage Playbook.
- [x] Add location field and DateTimePicker for plantedAt to plant setup.

## Deferred pending reviewed contracts

- [ ] Define any future care-suggestion or reminder behavior through separately reviewed product and knowledge contracts; do not infer it from review-stage playbooks.
- [ ] Obtain qualified Vietnamese grape-growing review before promoting any grape stage content beyond `review`.
