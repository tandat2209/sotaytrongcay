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

`MOBILE_UX_DESIGN.md` is the canonical contract for screen behavior, navigation, actions, states, and user-visible copy. This document owns only the reusable visual system and presentation treatment. Its screen examples explain how a confirmed UX contract should look; they must not introduce, override, or duplicate behavior.

## 2. Reference index

| Order | Reference                              | Intended use                                             | Status notes                                                             |
| ----- | -------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| 00    | `00-design-system-source`              | Original generated token reference                       | Supporting source only                                                   |
| 01    | `01-welcome`                           | Onboarding direction                                     | Revise copy toward care tracking                                         |
| 02    | `02-today-overview`                    | Today hierarchy, care prompts, and “Thêm nhật ký”        | Current direction; replace placeholders and complete four-tab navigation |
| 03    | `03-add-plant-select-species`          | Species search and selection                             | Strong layout reference                                                  |
| 04    | `04-add-plant-details`                 | Plant setup and stage selection                          | Validate fields and stage list                                           |
| 05    | `05-add-plant-success`                 | First next step after plant creation                     | Reduce celebration and blocking UI                                       |
| 06    | `06-plant-detail`                      | Plant summary, tips, and care history                    | Tracking controls must be prominent                                      |
| 07    | `07-stage-playbook`                    | Stage guide hierarchy                                    | Strong reference; content needs review                                   |
| 08    | `08-manual-watering`                   | Manual watering bottom sheet                             | Do not prefill unsupported amounts                                       |
| 09    | `09-manual-fertilizing-recommendation` | Superseded fertilizing reference                         | Do not use                                                               |
| 10    | `10-manual-fertilizing-details`        | Superseded fertilizer detail fields                      | Do not use for the MVP entry flow                                        |
| 11    | `11-manual-spraying`                   | Manual spraying detail treatment                         | Product/dosage content is exploratory                                    |
| 12    | `12-new-journal-entry`                 | Photo, notes, plant selection, and optional stage change | Strong current-flow reference                                            |
| 13    | `13-journal`                           | Global chronological history                             | Add source labels and full filters                                       |
| 14    | `14-me-settings`                       | Secondary-management grouping                            | Content may inform More; Settings is no longer a persistent tab          |
| 15    | `15-fertilizing-care-entry`            | Fertilizing draft and suggestion reference               | Use one compact add sheet; follow `SCREEN_REVIEW.md`                     |

Single-screen references keep `screen.png` and `code.html` together. A multi-screen feature reference uses one `NN-feature-purpose` directory with matching ordered pairs such as `01-main-sheet.png` and `01-main-sheet.html`. All reference directories and files use English `kebab-case`; generated or temporary Vietnamese slugs must be renamed during review.

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

### Compact action hierarchy

- Prefer compact, scannable layouts and progressive disclosure over repeated explanatory copy.
- Use familiar Lucide icons for local actions when they clearly communicate intent. Every icon action needs a Vietnamese accessibility label; a tap may reveal secondary explanation.
- Reserve full-width primary buttons for the single consequential action in a focused screen or modal. Use icon or text actions for local adjustments.
- Do not rely on an icon alone for destructive, irreversible, or ambiguous actions.

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

| Role           | Reference value | Use                                |
| -------------- | --------------- | ---------------------------------- |
| Background     | `#F6F4EE`       | Warm application background        |
| Surface        | `#FFFFFF`       | Cards, sheets, inputs              |
| Surface muted  | `#ECEAE3`       | Quiet grouped or pressed surfaces  |
| Primary        | `#536B3E`       | Primary actions, active navigation |
| Primary soft   | `#DDE8CC`       | Selected and supportive treatment  |
| Text           | `#24251F`       | Primary content                    |
| Text secondary | `#6E7066`       | Supporting information             |
| Text muted     | `#929489`       | Low-emphasis metadata              |
| Divider        | `#DEDDD5`       | Restrained structural separation   |
| Danger         | `#A8453D`       | Accessible warning/error content   |

Watering uses blue, fertilizing amber, spraying teal, and observations purple. Each activity owns a soft background, a brighter accent, and a darker accessible foreground for icons and text. Healthy or completed states use primary green; destructive and overdue states use danger red. Activity colors are semantic, not decorative, and must always be paired with text or a Lucide icon.

### Typography

- Use Nunito Sans throughout the application. Load dedicated Regular 400, Medium 500, SemiBold 600, Bold 700, and ExtraBold 800 font assets at the app root so Vietnamese text renders consistently on iOS, Android, and web.
- Do not mix serif and sans-serif typography between destinations.
- Display: 32/38, weight 800.
- Screen title: 28/34, weight 800.
- Section title: 22/28, weight 700.
- Card title: 18/24, weight 700.
- Body: 16/24, weight 500.
- Secondary: 14/20, weight 400.
- Label: 13/17, weight 700.
- Use a same-size 16/24 SemiBold body variant only when inline emphasis or a control label requires it; do not invent another font size.
- Support Dynamic Type and avoid fixed-height text containers.

### Spacing and shape

- Use a 4-point spacing grid.
- Use the shared `4 / 8 / 12 / 16 / 24 / 32 / 40 / 48` spacing scale.
- Default horizontal screen margin: 20 points.
- Related vertical spacing: 12–16 points.
- Major section spacing: 32–48 points.
- Use 12 points for small controls, 16 for medium surfaces, 20 for cards, and 28 for large image or sheet surfaces.
- Chips and compact statuses use a pill shape.
- Minimum touch target: 44 × 44 points.

### Elevation

- Prefer tonal surfaces and restrained dividers over borders around every group.
- Avoid heavy shadows and nested cards.
- Reserve one subtle ambient shadow token for bottom sheets and genuinely floating controls.
- Do not use glass effects as a default surface treatment.

## 6. Navigation

Navigation destinations, routes, and allowed actions are defined in `MOBILE_UX_DESIGN.md`. This section defines only their visual treatment.

Bottom navigation contains four destinations:

1. “Hôm nay”
2. “Cây trồng”
3. “Nhật ký”
4. “Mở rộng”

The active destination uses primary green for icon and label. Inactive destinations use a neutral color with sufficient contrast.
Use restrained opacity feedback when pressing a destination; avoid a full-cell ripple that competes with the selected-state color.

Focused forms hide bottom navigation rather than showing a misleading active destination.

## 7. Information hierarchy

The visual examples in this section do not define screen content, action availability, or data behavior; those remain in `MOBILE_UX_DESIGN.md`.

### Create Plant

Place the optional plant photo before the name so the selected image provides immediate identity. Present “Chậu” and “Đất” as equal-width icon-led choices with a clear selected state. Render the current stage as one bordered select control showing the selected stage icon and title; open the complete stage list in the standard native bottom sheet.

### Today

Show information in this order:

1. Weather that affects care.
2. Due reminders.
3. “Việc cần làm hôm nay” with relevant “Tưới nước”, “Bón phân”, and “Phun thuốc” actions.
4. Recently completed activities.
5. Current plant and growth-stage context.
6. Progress toward the next milestone.

Each care priority shows a trackable activity and a short “Vì sao” in its compact default state. Its reviewed explanation and safe guidance expand only when requested; Today does not show “Đã xem xét” or task-review state. A direct care action opens a prefilled care form; nothing is recorded until the user selects “Lưu hoạt động”.

Visually group Today priorities in one `SurfaceCard` per plant. Use the compact `PlantIdentity` as the card header with a trailing chevron, then stack activity rows vertically with hairline separators. Keep every activity's icon, status, disclosure, and full-width tinted action together; do not nest a second card inside the plant card.

Show “Thêm nhật ký” as a secondary action, visually distinct from care due today. Stage changes live inside this journal flow.

End Today with “Cây của tôi”: a horizontal rail of 160-point photo-first cards showing the latest persisted photo, plant name, species, and stage. Keep “Thêm cây” as a labelled 44-point action in the section heading instead of another placeholder card in the rail. Use the leaf fallback when a plant has no readable saved photo.

### Plant List and multi-plant care

Keep “Chọn nhiều” as a compact labelled header action rather than a floating control. In selection mode, preserve each compact `PlantIdentity`, replace the trailing chevron with a high-contrast check control, and give the full row accessible selected state. Pin one full-width “Tiếp tục ({count})” action above the safe area. The activity choice uses three large labelled rows with the existing watering, fertilizing, and spraying semantic visuals. Batch Care Entry uses a compact selected-count summary with wrapping Plant names; confirmation keeps the complete name list readable before the final save.

### Plant Detail

Prioritize:

1. Plant identity presented over the latest persisted photo hero when available, with a compact leaf fallback when absent.
2. Compact, horizontally scrollable 12-stage lifecycle journey as the single current-stage identifier.
3. Compact current-stage objective without repeating the stage title.
4. Large watering and fertilizing care cards with sourced frequency, last activity, deterministic status, and guide action. Pressing the activity identity opens its prefilled Care Entry; the bottom-centered radial action menu remains the complete entry point for all record types.
5. Weather context.
6. Three most recent saved journal entries, interleaving care activities and plant updates.

Use the 8/16/24-point spacing scale consistently, 24-point care-card padding, 20-point care-card corners, and large type. Keep journey compact and horizontal; all 12 stages remain reachable by scrolling. Do not replace it with percentage progress.

When a latest persisted photo exists, use a 16:9 rounded hero and place the plant name and a wrapping metadata row at the bottom over a dark contrast gradient. The row contains the species pill and, when sourced dates exist, a matching translucent-white age pill. The whole hero opens the uncropped image in a full-screen viewer. Do not place the stage title in the hero because the journey immediately below owns that context. Without a saved photo, keep identity compact and use solid pale-green pills rather than enlarging the leaf placeholder.

The age pill keeps a stable width. When both current-stage and planted ages exist, switch the text every ten seconds using a restrained vertical slide and crossfade. Show current-stage age first. Respect reduced motion by presenting both values statically, and let the metadata row wrap for narrow screens or larger text.

Within each care card, keep the activity icon compact and align it with the title. Frequency is supporting text rather than a filled chip, the info action has secondary emphasis while retaining its touch target, and last activity and status share one section without a divider.

Keep the Plant Detail radial action button centered above the bottom navigation. While closed, cycle through the four semantic action icons and colors with restrained motion. On open, pause cycling, dim the page, animate all four labelled actions outward from the center onto a balanced upward arc, and replace the center button with a fixed close state at the same anchor. Use semantic activity colors and soft action surfaces; the close button and backdrop both dismiss the menu. Reduced motion uses a static green create icon and a static open state.

Label the compact mixed-history section “Nhật ký gần đây”. Care rows use their activity visual; Plant Update rows use the first photo thumbnail when present or a note icon otherwise. Keep both row types visually equivalent and route each to its own detail screen.

Do not display fabricated photo, health, days-in-stage, progress, or sensor measurements. Current-stage age requires the persisted stage-start timestamp; planted age requires the user-provided planting date. Every value needs a persisted user, device, knowledge, or provider source and freshness where relevant.

### Stage playbook

Use progressive sections for the stage goal, tracked Care Plans, generic informational guides with authored instructions, stage threat guidance, completion criteria, and next stage. Use a small target icon for the stage goal. Care Plan and informational-guide cards use their icon and title in a compact header; expanding them reveals their supporting content.

When an authored stage illustration is available, use it in the rounded Stage Playbook hero with a bottom contrast gradient for the stage title, duration, and objective. The image is a general visual reference, never a replacement for the user's persisted Plant Update photo or evidence that the user's plant has reached the stage. Keep the primary-color hero as the loading/error fallback.

Keep guidance scannable. Do not turn the screen into an unstructured article or a product catalog.

## 8. Form and feedback visual treatment

Care and journal behavior, persistence, fields, and safety boundaries belong to `MOBILE_UX_DESIGN.md`. Present the confirmed flow with a clear minimum path, progressive disclosure for secondary details, units beside numeric inputs, preserved drafts after validation or network errors, and inline or temporary feedback after routine saves.

## 9. Components

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

### Floating action menu

- Keep the control local to Plant Detail and expand it into four labeled actions: watering, fertilizing, spraying, and “Thêm nhật ký”.
- Use the matching activity or camera icon for each action and a close icon while expanded.
- While closed, change the icon about every three seconds, slide the four action icons from left to right, pair each one with its activity color, and use one short bounce per change; do not run a continuous pulse.
- Animate expansion with restrained opacity, scale, and position changes; when reduced motion is enabled, reveal the actions without spatial movement.
- Dismiss on backdrop press and preserve a minimum 44 × 44 point target for every action.

### Inputs and selection

- Use clear persistent labels, not placeholder-only fields.
- Put units beside numeric inputs.
- Preserve typed values on validation or network failure.
- Use controls that remain understandable without color.

### Plant identity

Use shared `PlantIdentity` for compact identity surfaces such as plant lists, Today priorities, journal, detail headers, and entry flows. It derives the latest persisted photo from Plant Updates and otherwise shows the leaf fallback; compact rows place that image at left, followed by name, species title, stage icon, and stage title. The Today plant rail uses the same identity content as a photo-first vertical card. Plant Detail is the deliberate exception: `PlantDetailHero` enlarges the latest derived persisted journal photo, overlays name and species, and leaves stage context to the lifecycle journey. A real photo may render only through a persisted URI contract, and an unreadable URI falls back without hiding text. Keep placeholder and stage icons decorative when visible text already identifies the plant.

### Icons and images

- Use Lucide React Native as the coherent icon family.
- Give each rendered screen one semantic title or identity icon.
- Pair unfamiliar icons with Vietnamese labels.
- Provide accessibility labels.
- Plant photos should be realistic and relevant to the displayed species/stage.
- Do not ship placeholder images, fantasy characters, or unrelated plant photography.

## 10. Required visual states

Use one shared treatment for initial full-screen loading: center the app logo in a circular `primarySoft` field, show the app name below it, then pair a small primary activity indicator with concise Vietnamese loading text. Keep the background quiet, preserve safe areas, and avoid skeletons when the entire screen lacks a stable content shape. Inline and incremental loading retain the visual hierarchy of their owning control or section.

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

## 11. Accessibility

- Meet WCAG AA contrast.
- Support text scaling without clipping.
- Never communicate health, weather, reminder, or activity status using color alone.
- Give icon-only controls accessible Vietnamese labels.
- Preserve logical focus when opening or dismissing bottom sheets.
- Respect reduced motion.
- Avoid confetti or bouncing animation when reduced motion is enabled.

## 12. Known mockup exceptions

Do not copy these details into implementation:

- Placeholder plant images and the unrelated avatar in `02-today-overview`.
- Generic “Thực hiện” labels in `02-today-overview`; implementation should use explicit care labels.
- Incomplete bottom navigation in `02-today-overview`; implementation keeps all four destinations.
- Serif typography in `14-me-settings`; secondary destinations under More use shared sans-serif typography.
- “Hôm nay” active while viewing a plant in `06-plant-detail`.
- Prescriptive products, dosages, watering values, and sensor readings.
- Missing Journal source labels and plant/date/activity filters.
- Duplicate care suggestions in Plant Detail.

## 13. Missing reference screens

Before treating the set as an implementation baseline, add references for:

- Stage-tip variants for advice, avoidance, warning signs, and milestones.
- Today care prompt opening a prefilled Care Entry.
- Reminder opening a prefilled Care Entry.
- Journal entry with changed-stage and validation/error variants.
- Completion-criteria checklist.
- Reminder Management.
- More index and its selected fourth-tab state.
- Fertilizer Management in standalone mode and Care Entry selection mode.
- Journal source labels and full filter sheet.
- Empty, loading, offline, stale-weather, and error variants.

## 14. Handoff checklist

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
