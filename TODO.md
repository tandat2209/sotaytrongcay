# Work backlog

Prioritize care-tracking usefulness and entry speed before expanding guidance.

## Knowledge model and UI follow-up

Follow the accepted direction in [the 2026-07-16 Knowledge model and UI impact audit](./docs/research/2026-07-16-knowledge-model-ui-impact.md). Keep content corrections, optional model fields, and recommendation-state UI in separate phases.

### Phase 1 — content and review

- [x] Author one narrow, source-backed grape `spraying` Care Plan at `review` status for bud-break powdery-mildew prevention; it names no commercial product, prescribes no dosage, and is excluded from the production bundle.
- [x] Add schema-validated `pest` and `disease` Knowledge Base catalogs with stable review-only grape targets for bọ trĩ and bệnh phấn trắng; compile them only into preview bundle `1.1.0`.
- [x] Extend the review-only grape pest catalog with rệp sáp, rệp vảy, rệp hại rễ nho (phylloxera), and rệp muội using source-bounded observation, prevention context, safe first response, and escalation guidance only.
- [x] Show stage-matched review Pest and Disease guidance as collapsed, read-only cards in the preview Stage Playbook; it remains observation context and does not affect care recommendations, reminders, or activity logging.
- [x] Remove unlinked knowledge topics from Plant Detail, Stage Playbook, authored Stage Playbooks, and newly compiled bundles; accept and ignore the legacy compiled property for older preview bundles.
- [ ] Obtain qualified review of the first spraying Care Plan's Vietnamese wording, stage applicability, purpose, safety boundaries, and sources before approval.
- [ ] Obtain qualified review of both target documents, including observable evidence, monitoring stages, prevention, escalation, and the age and limitations of the Vietnamese thrips source.
- [ ] Obtain qualified review of the added grape pest targets, including local applicability, identity limits, monitoring stages, and safe escalation; do not promote them from `review` based on foreign extension sources alone.
- [ ] Audit every review-stage Care Plan for contradictions among `frequency.display`, `frequency.interval_days`, and `eligibility.suggest_after_days`; correct content without changing the schema.
- [ ] Move generic techniques and event-specific guidance that the elapsed-time engine cannot evaluate into Care Guides without creating Today cards, reminders, or history.

### Phase 2 — optional backward-compatible fields

- [ ] Add optional `recommendation_mode: action | check` and structured `check_before_acting` fields to authored and compiled Care Plans, compiler types, schemas, validators, fixtures, and documentation.
- [ ] Add an explicit Knowledge Base bundle adapter that accepts `1.0.x` and `1.1.x`, defaults an omitted recommendation mode to `action`, and rejects unsupported major versions.
- [ ] Add optional `application_method` to reviewed fertilizer suggestions and prefill it as an editable Fertilizer Application draft without selecting or saving anything automatically.
- [ ] Add optional `recommended_spray_purpose: prevention | treatment` to Care Plans without changing eligibility or reminder timing.
- [ ] Add nullable saved spraying product-name and purpose fields with a forward SQLite migration; preserve all legacy spraying rows without backfill or note parsing.
- [x] Add an optional stable target ID plus immutable target-name snapshot to saved spraying in the unreleased SQLite V1 baseline; keep a saved target available while editing if the current catalog no longer contains it.
- [ ] Define target-aware Care Plan scope without weakening the one-plan-per-species/stage/activity rule or treating monitoring relevance as spray eligibility.
- [ ] Extend progressive spraying entry with optional purpose and product name. The optional curated single-target chips are complete; plant, time, and explicit Save remain the minimum path.
- [x] Add target-compatible spraying summaries to Activity Detail, Journal, Today recent history, and Plant Detail recent history, with generic spraying text as the legacy fallback.

### Phase 3 — action/check presentation

- [ ] Derive action/check presentation from the existing evaluator plus `recommendationMode` without persisting recommendation instances.
- [ ] Update Today cards so `check` opens inspection guidance and recording remains a separate explicit action.
- [ ] Update Plant Detail care cards and details to show state, last activity, reason, and check-before-acting guidance without making every Care Plan look pending.
- [ ] Update Care Plan schedule settings and notification reconciliation so check schedules use “Kiểm tra…” wording while preserving existing snapshots and preferences.
- [ ] Add regression coverage for absent optional fields, Knowledge Base `1.0.0`, legacy watering intensity, fertilizing without item IDs, generic spraying history, and existing reminder preferences.

### Deferred from this model slice

- [ ] Evaluate `monitor` and `withhold` only after reviewed weather, symptom, observation, or risk inputs exist.
- [ ] Evaluate recommended watering intensity only after the engine has sufficient reviewed context; never prefill exact volume.
- [ ] Evaluate one-time or event-based schedules only after the engine can observe the triggering event.
- [ ] Implement normalized Warning Sign entities and relationship validation before allowing non-empty `warningSignIds` in pest or disease targets.
- [ ] Evaluate spray inventory, product-label data, and separate spraying-related activity types only after user research demonstrates a management or safety need.

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

- [x] Prototype Plant Detail with an informational lifecycle journey, current-stage objective, deterministic watering/fertilizing care cards, plant-scoped Quick Care, recent saved care, and weather context.
- [x] Prototype and review fast watering and fertilizing entry flows.
- [ ] Validate the multi-fertilizer draft and nested add/edit flow with home grape growers.
- [ ] Validate whether growers understand both “Thêm loại phân” in Care Entry and `Mở rộng → Quản lý phân bón` as access to the same private catalog.
- [ ] Validate whether inline reviewed fertilizer chips, automatic catalog reuse, and saved last-use context reduce fertilizing-entry time without being mistaken for automatic prescriptions.
- [ ] Prototype Today care buttons that open prefilled care entry after recommendation behavior is approved.
- [ ] Remove standalone Task Guidance and guided-completion flows.
- [x] Add “Thêm nhật ký” with photos, notes, and optional stage change to Plant Detail.
- [ ] Add “Thêm nhật ký” to Today.
- [ ] Remove the global FAB and Quick Action menu.
- [ ] Add Journal source labels and filters.
- [ ] Verify loading, empty, error, stale-weather, permission-denied, and offline states on physical iOS and Android devices.
- [x] Derive the Plant Detail photo from persisted user-captured Plant Update photos.
- [x] Present the latest persisted Plant Detail photo as a tappable identity hero with a compact no-photo fallback.
- [x] Interleave saved care and Plant Updates in Plant Detail’s three-entry recent journal.
- [x] Show latest persisted Plant Update photos across compact plant identity surfaces and as photo-first cards on Today.
- [ ] Define explicit user-observation or sourced-measurement contract before showing plant health status.
- [x] Persist nullable current-stage start time, backfill only from matching stage history, and show age conditionally without inferring from `createdAt` or `plantedAt`.
- [ ] Let growers optionally enter when the initial selected stage began when adding or editing an existing plant.
- [ ] Show Care Plan details in Today priority cards after reviewed UX and content scope.
- [x] Replace the current icon set with Lucide to use more nature and weather icons

## Engineering

- [x] Move application-owned Vietnamese copy behind typed translation keys.
- [x] Define the feature-first, local-first architecture and Supabase sync strategy.
- [x] Update architecture for derived care suggestions and three tracked care activities.
- [x] Bootstrap strict TypeScript, quality gates, and test infrastructure.
- [x] Consolidate the unreleased SQLite schema into one atomic V1 fresh-install baseline and enable WAL plus foreign keys before repository access.
- [x] Serialize local SQLite writes and move multi-step saves to exclusive transactions that use the transaction handle.
- [x] Replace broad `INSERT OR IGNORE` writes with explicit idempotency handling and verify affected-row counts where a no-op is unexpected.
- [x] Add cursor pagination or bounded reads for growing Journal and photo result sets.
- [x] Add an Android fresh-install database smoke command for the first production release.
- [ ] Run the database smoke command on the first Android release-candidate APK and record the result.
- [ ] Add the schema-validated Markdown Knowledge Repository.
- [x] Build first-slice plants with species-defined stages and a truthful pending-guidance state.
- [x] Build first-slice manual watering entry and activity history.
- [x] Replace visible exact-liter watering entry with stable one-tap intensity and hidden optional estimated liters.
- [x] Build first-slice Plant Detail recent-watering summary and global Journal/Activity Detail views.
- [x] Deliver current-data Plant Detail slice: three care types summarised and recordable, stage identity, review-guidance text, weather context, recent care history, activity detail navigation, and 'Hướng dẫn chi tiết' link to stage playbook.
- [x] Extend the first slice with fertilizing, spraying, and full Plant Dashboard care summaries.
- [ ] Add plant editing and archive flows.
- [x] Add local photo-and-note Plant Updates with user-confirmed stage history, Journal display, and derived Plant Detail photos.
- [x] Add Care Plan schedule snapshots and local notification delivery.
- [ ] Add a complete mixed-event Timeline.
- [x] Implement the reviewed one-to-many fertilizer-application contract.
- [x] Replace the Settings tab with More and add reusable User Fertilizer management with contextual selection from Care Entry.
- [x] Add approved stage guidance and a guide reader: StagePlaybookScreen has a read-only Plant Detail entry and an inline stage-schedule editor when opened from More.
- [x] Add an attributed weather provider, explicit coarse weather location, normalized local cache, and independent Today/Plant Detail display states.
- [x] Build the first deterministic watering suggestion without persistent task instances, including transparent positive and negative Today evaluations.
- [ ] Obtain reviewed guide instructions before promoting migrated grape recommendation guides beyond `review`.
- [ ] Define differentiated recommendation priorities only after reviewed product ordering policy exists.
- [ ] Extend reviewed deterministic care suggestions to additional stages and care types.
- [ ] Add offline synchronization.
- [ ] Verify backup, restore, export, deletion, and content-version migration.

## Future

- [ ] Add alternate UI and Knowledge Base catalogs plus persisted runtime locale selection when another language enters delivery scope.
- [ ] Evaluate additional Care Plan schedule policies after user feedback.
- [ ] Evaluate guidance for additional plant species.
- [ ] Evaluate AI personalization only after deterministic suggestions prove useful.
- [ ] Evaluate diagnostics, collaboration, analytics, and connected devices.

## Completed

- [x] Create project context and canonical vocabulary.
- [x] Define mobile navigation and design guidelines.
- [x] Define technical and Knowledge Base architecture.
- [x] Separate user data from curated knowledge.
- [x] Distinguish trackable care from informational stage tips.
- [x] Review mockups 01–15 against the current product and Knowledge Base contract.
- [x] Author a sourced "Nuôi thân" grape Knowledge Base pilot with stable IDs and schemas.
- [x] Remove reminder-template and task/transition behavior from the review-stage grape playbook contract.
- [x] Align Knowledge Base documentation ownership and precedence with schemas and accepted product decisions.
- [x] Surface stage playbook content inline on Plant Detail (objective, knowledge topics, exit criteria).
- [x] Implement StagePlaybookScreen as a general-purpose, stage-focused guide reader (not plant-specific); reachable from Plant Detail via 'Hướng dẫn chi tiết' CTA; supports forward browsing through stages via stageId query param.
- [x] Show complete stage Care Plan details in Stage Playbook, including activity, goal, ground/container guidance, input categories, and important notes.
- [x] Add stage-specific icons (12 stages mapped to Lucide) consistently across Plant Detail, Plant List, and Stage Playbook.
- [x] Add one bundled review-stage illustration for each grape Stage Playbook, with a static image-ID resolver and fallback hero.
- [x] Add location field and DateTimePicker for plantedAt to plant setup.

## Deferred pending reviewed contracts

- [ ] Define any future care-suggestion or reminder behavior through separately reviewed product and knowledge contracts; do not infer it from review-stage playbooks.
- [ ] Obtain qualified Vietnamese grape-growing review before promoting any grape stage content beyond `review`.
