# Mobile design guidelines

## 1. Status and authority

The files under `docs/design/mockups/` are visual references. They are not the source of truth for product behavior, agronomic guidance, navigation rules, or data requirements.

Use this precedence when sources disagree:

1. `docs/PROJECT_CONTEXT.md`
2. `docs/MOBILE_UX_DESIGN.md`
3. `docs/KNOWLEDGE_BASE_ARCHITECTURE.md`
4. This document
5. Individual mockups

Mockups may contain exploratory copy, generated images, placeholders, unsupported recommendations, or outdated flows. Engineering must not infer requirements from those details.

See [SCREEN_REVIEW.md](./SCREEN_REVIEW.md) for the current screen-by-screen product and Knowledge Base assessment.

## 2. Reference index

| Order | Reference | Intended use | Status notes |
| --- | --- | --- | --- |
| 00 | `00-design-system-source` | Original generated token reference | Supporting source only |
| 01 | `01-welcome` | Onboarding direction | Revise copy toward care tracking |
| 02 | `02-today-overview` | Today hierarchy, care prompts, and “Thêm nhật ký” | Current direction; replace placeholders and complete four-tab navigation |
| 03 | `03-add-plant-select-species` | Species search and selection | Strong layout reference |
| 04 | `04-add-plant-details` | Plant setup and stage selection | Validate fields and stage list |
| 05 | `05-add-plant-success` | First next step after plant creation | Reduce celebration and blocking UI |
| 06 | `06-plant-detail` | Plant summary, tips, and care history | Tracking controls must be prominent |
| 07 | `07-stage-playbook` | Stage guide hierarchy | Strong reference; content needs review |
| 08 | `08-manual-watering` | Manual watering bottom sheet | Do not prefill unsupported amounts |
| 09 | `09-manual-fertilizing-recommendation` | Fertilizing context and warning | Products are not approved content |
| 10 | `10-manual-fertilizing-details` | Optional fertilizer detail fields | Keep optional and collapsed |
| 11 | `11-manual-spraying` | Manual spraying detail treatment | Product/dosage content is exploratory |
| 12 | `12-new-journal-entry` | Photo, notes, plant selection, and optional stage change | Strong current-flow reference |
| 13 | `13-journal` | Global chronological history | Add source labels and full filters |
| 14 | `14-me-settings` | Me information architecture | Use the shared sans-serif typography |

Each numbered screen directory keeps its `screen.png` and `code.html` together. Future references should follow `NN-short-purpose` naming.

## 3. Product expression

The experience should feel like an experienced gardener accompanying a beginner.

The visual hierarchy must reinforce:

- Track important care quickly.
- Guide in context.
- Treat tips as information, not tasks.
- Teach progressively.
- Explain why.
- Reduce decision fatigue.
- Help beginners succeed.

Last core care, contextual entry, reminders, and trustworthy history are primary. Current-stage tips are supporting information.

## 4. Language

- All user-visible product text is Vietnamese.
- Documentation, code, tokens, and technical names remain English.
- Scientific names may appear with a Vietnamese common name.
- Do not expose icon-font names such as `arrow_back` or `more_vert`.
- Do not use English placeholders such as “Capture & Caption” or “Add a Caption”.
- User-facing knowledge comes from approved Vietnamese Knowledge Base content.

## 5. Visual foundation

### Color

Use semantic roles rather than copying raw colors into components.

| Role | Reference value | Use |
| --- | --- | --- |
| Background | `#FCF9F8` | Warm application background |
| Surface | `#FFFFFF` | Cards, sheets, inputs |
| Primary | `#154212` | Primary actions, active navigation |
| Primary container | `#2D5A27` | Strong branded surfaces |
| Secondary | `#65558F` | Stage or milestone emphasis only |
| Text | `#1C1B1B` | Primary content |
| Text secondary | `#42493E` | Supporting information |
| Border | `#C2C9BB` | Structural separation |
| Error | `#BA1A1A` | Validated warning/error states |

Hydration may use soft blue, sunlight amber, and urgent plant-health states muted red. Color must always be paired with text or an icon.

### Typography

- Use Inter or the approved cross-platform sans-serif fallback.
- Do not mix serif and sans-serif typography between destinations.
- Headline large: 28/34, weight 600.
- Headline medium: 22/28, weight 600.
- Headline small: 18/24, weight 600.
- Body large: 16/24, weight 400.
- Body medium: 14/20, weight 400.
- Labels: 12/16 or larger when interaction-critical.
- Support Dynamic Type and avoid fixed-height text containers.

### Spacing and shape

- Use a 4-point spacing grid.
- Default horizontal margin: 16 points.
- Related vertical spacing: 16 points.
- Section spacing: 24 points.
- Cards and inputs: 12–16 point radius.
- Bottom sheets: 24 point top radius.
- Chips: 8 point radius or pill shape.
- Minimum touch target: 44 × 44 points.

### Elevation

- Prefer tonal surfaces and one-pixel borders.
- Avoid heavy shadows and nested cards.
- Reserve a subtle ambient shadow for bottom sheets.
- Do not use glass effects as a default surface treatment.

## 6. Navigation

Bottom navigation contains four destinations:

1. “Hôm nay”
2. “Cây trồng”
3. “Nhật ký”
4. “Tôi”

The active destination uses primary green for icon and label. Inactive destinations use a neutral color with sufficient contrast.

Do not add a global FAB. Plant Detail may use one local Quick Care FAB for plant-scoped core care; Today remains FAB-free. The FAB opens Care Entry and never saves directly.

Plant Detail keeps “Cây trồng” active. A focused form should not show a misleading destination state.

## 7. Information hierarchy

### Today

Show information in this order:

1. Weather that affects care.
2. Due reminders.
3. “Việc cần làm hôm nay” with relevant “Tưới nước”, “Bón phân”, and “Phun thuốc” actions.
4. Recently completed activities.
5. Current plant and growth-stage context.
6. Progress toward the next milestone.

Each care priority shows a trackable activity and a short “Vì sao” in its compact default state. Its reviewed explanation and safe guidance expand only when requested; Today does not show “Đã xem xét” or task-review state. A direct care action opens a prefilled care form; nothing is recorded until the user selects “Lưu hoạt động”.

Show “Thêm nhật ký” as a secondary action, visually distinct from care due today. Stage changes live inside this journal flow.

### Plant Detail

Prioritize:

1. Plant identity and confirmed current stage.
2. Compact, horizontally scrollable 12-stage lifecycle journey with current position only.
3. Compact current-stage objective.
4. Large watering and fertilizing care cards with sourced frequency, last activity, deterministic status, and guide action. Use Plant Detail Quick Care as the single record action.
5. Stage topics and upcoming milestone.
6. Weather context.
7. Three most recent saved care activities.

Use the 8/16/24-point spacing scale consistently, 24-point care-card padding, 20-point care-card corners, and large type. Keep journey compact and horizontal; all 12 stages remain reachable by scrolling. Do not replace it with percentage progress.

Do not display fabricated photo, health, days-in-stage, progress, or sensor measurements. Every value needs a persisted user, device, knowledge, or provider source and freshness where relevant.

### Stage playbook

Use progressive sections for goal, watering, fertilizers, stage tips, avoid list, common problems, completion criteria, and next stage.

Keep guidance scannable. Do not turn the screen into an unstructured article or a product catalog.

## 8. Care recording and history

Only selecting “Lưu hoạt động” in Care Entry creates a care record. Reading a tip, opening a care prompt, or responding to a reminder must not create history.

“Lưu nhật ký” creates a flexible photo-and-note plant update. Pruning and observations may appear in its note but are not dedicated activity types.

The form shows “Giai đoạn hiện tại” and a secondary “Thay đổi” control. Keep the current stage by default; never require users to reconsider it for every photo.

Preferred feedback:

`Đã lưu hoạt động`

After Save, offer an optional next-reminder suggestion such as “7 ngày”, “14 ngày”, “30 ngày”, or “Không nhắc”.

Entries opened from Today prompts display “Từ hôm nay”. Other source labels are “Từ lời nhắc” and “Ghi thủ công”. These labels describe entry origin, not automatic recording.

Use full-screen success only for a meaningful onboarding milestone if user testing supports it. Routine saves use inline or temporary confirmation.

## 9. Manual-entry patterns

Care Entry is the single path for watering, fertilizing, and spraying. “Thêm nhật ký” handles photos, notes, pruning, observations, and other updates.

- Keep plant, activity, and time as the minimum path.
- Place product, amount, dosage, method, notes, and photos under “Thêm chi tiết”.
- Never prefill fertilizer, pesticide, dosage, or water amount without approved Knowledge Base logic and sufficient context.
- Show weather as context, not fabricated certainty.
- Change the plant's stage only when the user selects a different stage and saves the journal entry.
- Future photo analysis may suggest a stage, but it must never change the confirmed stage automatically.
- Display the current stage as read-only context unless the user enters an explicit stage-transition flow.

## 10. Agronomic and safety content

The following mockup content is exploratory and not approved guidance:

- Fixed watering frequency or amount.
- Soil-moisture values without measurements.
- `NPK 30-10-10`, `MKP 0-52-34`, or other fertilizer recommendations.
- Neem, biological products, specific pesticides, or “Thuốc đặc trị”.
- Product combinations and exact dosage.
- Disease or pest conclusions inferred from one symptom.

Approved content must come from the Knowledge Base with stable ID, version, references, reviewer, scope, and Vietnamese explanation.

Prefer safe actions such as checking soil moisture, reviewing recent care, observing warning signs, or consulting reviewed guidance.

## 11. Components

### Buttons

- Primary: deep green surface, white label, at least 48 points high.
- Secondary: transparent surface, green border and label.
- Use one high-emphasis action per focused region.
- Button labels describe the result, such as “Lưu hoạt động” or “Hoàn thành”.

### Cards

- Use white surfaces, thin borders, and 12–16 point radii.
- Cards group one meaningful object or decision.
- Avoid placing every section inside a card.
- Do not use cards to simulate unavailable data.

### Bottom sheets

- Use for compact care forms, filters, and small selections.
- Include a visible grab handle only when drag dismissal is supported.
- Keep the primary action above the safe area and keyboard.
- Avoid sheets that require excessive scrolling for a routine action.

### Inputs and selection

- Use clear persistent labels, not placeholder-only fields.
- Put units beside numeric inputs.
- Preserve typed values on validation or network failure.
- Use controls that remain understandable without color.

### Plant identity

Use shared `PlantIdentity` whenever a screen has plant identity data. Layout: photo or leaf placeholder at left; name; then species title, stage icon, and stage title. Existing plants have no persisted photo URI, so use the leaf placeholder. A real photo may render only after a persisted URI contract exists. Keep placeholder and stage icon decorative when visible text already identifies the plant.

### Icons and images

- Use one coherent icon family.
- Pair unfamiliar icons with Vietnamese labels.
- Provide accessibility labels.
- Plant photos should be realistic and relevant to the displayed species/stage.
- Do not ship placeholder images, fantasy characters, or unrelated plant photography.

## 12. Required states

Every production screen considers:

- populated;
- empty;
- initial loading;
- incremental loading;
- offline;
- stale data;
- recoverable error;
- permission denied when applicable;
- destructive confirmation;
- success and undo.

Weather sections fail independently. Knowledge and local history remain usable offline. Care Entry and “Thêm nhật ký” remain available when prompts cannot load.

## 13. Accessibility

- Meet WCAG AA contrast.
- Support text scaling without clipping.
- Never communicate health, weather, reminder, or activity status using color alone.
- Give icon-only controls accessible Vietnamese labels.
- Preserve logical focus when opening or dismissing bottom sheets.
- Respect reduced motion.
- Avoid confetti or bouncing animation when reduced motion is enabled.

## 14. Known mockup exceptions

Do not copy these details into implementation:

- Placeholder plant images and the unrelated avatar in `02-today-overview`.
- Generic “Thực hiện” labels in `02-today-overview`; implementation should use explicit care labels.
- Incomplete bottom navigation in `02-today-overview`; implementation keeps all four destinations.
- Serif typography in `14-me-settings`.
- “Hôm nay” active while viewing a plant in `06-plant-detail`.
- Prescriptive products, dosages, watering values, and sensor readings.
- Missing Journal source labels and plant/date/activity filters.
- Duplicate care suggestions in Plant Detail.

## 15. Missing reference screens

Before treating the set as an implementation baseline, add references for:

- Stage-tip variants for advice, avoidance, warning signs, and milestones.
- Today care prompt opening a prefilled Care Entry.
- Reminder opening a prefilled Care Entry.
- Journal entry with changed-stage and validation/error variants.
- Completion-criteria checklist.
- Reminder Management.
- Journal source labels and full filter sheet.
- Empty, loading, offline, stale-weather, and error variants.

## 16. Handoff checklist

Before implementing a mockup, confirm:

- The flow matches `MOBILE_UX_DESIGN.md`.
- Guidance content exists in the approved Knowledge Base.
- All visible copy is Vietnamese.
- Navigation and contextual action state are correct.
- Required non-happy states are specified.
- Measurements and weather show source/freshness.
- No unsupported product, diagnosis, or dosage is implied.
- Accessibility and text scaling are covered.
- The implementation reuses design tokens and existing components.
