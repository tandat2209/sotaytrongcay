# Mobile-first UX design

## 1. Experience goal

The app should make important plant care easy to record and easy to review.

Users should quickly answer:

- When did I last water or fertilize this plant?
- What product and amount did I use?
- What care is due next?
- What should I know about the current growth stage?

Stage guidance supports care tracking through concise tips. It does not create a separate task-management system.

## 2. UX principles

### Track important care

- Watering, fertilizing, and spraying are dedicated tracked activities.
- Plant and time form the minimum care-entry path because the Today button supplies the activity type.
- Product, amount, method, dosage, notes, and photos remain optional.
- Last-care summaries are visible before the Timeline.

### Guide without manufacturing work

- Stage tips live inside Plant Detail.
- Tips have no checkbox, completion state, reminder, or journal entry.
- “Việc cần làm hôm nay” ranks relevant trackable care prompts rather than permanently listing every activity type.
- Each priority keeps its “Vì sao” and safe guidance collapsed by default; users expand them only when needed, without adding task state.
- “Đã xem xét” is not shown on Today; it remains contextual information in Plant Detail.
- Selecting a recommended care action opens a prefilled care-entry form.
- Nothing is recorded until the user saves the activity.

### Keep actions in context

- Bottom navigation contains places users revisit.
- The app has no global FAB or Quick Action menu.
- Today and Plant Detail expose the relevant care, journal, and stage actions.
- Reminders remain secondary to Today, Plant Detail, and Settings.

### Mobile-first

- Use minimum 44 × 44 point targets.
- Keep frequent actions within thumb reach.
- Use bottom sheets for short care forms and filters.
- Preserve drafts after validation, offline, or upload errors.
- Render local history before remote work.

### Trustworthy context

- All visible product text is Vietnamese.
- Weather includes source time and stale state.
- Measurements show their user, device, or provider source.
- Suggestions never imply that an activity happened.
- Product, dosage, and disease guidance requires approved knowledge.

## 3. MVP UX scope

- Create and edit plants.
- Set the current species-defined growth stage.
- Track watering, fertilizing, and spraying.
- Add photo-and-note journal entries for pruning, observations, growth, and other updates.
- Attach optional structured details, notes, and photos.
- View last care and next reminder for each plant.
- View stage tips, entry criteria overview, knowledge topics, and exit criteria.
- Browse to a full-stage playbook guide ("Hướng dẫn chi tiết") with detailed stage Care Plans, generic informational guides, and forward browsing to the next stage.
- Show contextual care buttons inside “Việc cần làm hôm nay”.
- Add “Thêm nhật ký” on Today and Plant Detail, with an optional stage change inside the journal form.
- View one plant's Timeline and a global Journal.
- Create and manage one-time reminders.
- View lightweight weather context.

Future scope includes recurring schedules, additional species, collaboration, analytics, diagnostics, AI, and connected devices.

## 4. Navigation architecture

### Bottom navigation

1. **Hôm nay** — weather, “Việc cần làm hôm nay”, reminders, quick plant updates, and recent activity.
2. **Cây trồng** — plants, care summaries, stage tips, and Timeline.
3. **Nhật ký** — global activity history.
4. **Cài đặt** — notification and Care Plan schedule configuration.

There is no central action layered over the navigation. Each action appears where the user has enough plant and care context to understand its result.

## 5. Core flows

### First use

`Chào mừng → Tạo cây đầu tiên → Chọn giai đoạn → Chi tiết cây`

### Record routine care

`Hôm nay → Việc cần làm hôm nay → Tưới nước, Bón phân hoặc Phun thuốc → Nhập chi tiết tùy chọn → Lưu hoạt động`

Shortest watering path:

`Hôm nay → Tưới nước → Lưu hoạt động`

### Add a plant update or change stage

`Hôm nay hoặc Chi tiết cây → Thêm nhật ký → Chọn cây nếu cần → Thêm ảnh + ghi chú → Giữ hoặc thay đổi giai đoạn → Lưu nhật ký`

Pruning, observations, growth, and general updates may be described here without becoming separate activity types. Stage selection is optional and defaults to the confirmed current stage.

### Review one plant

`Cây trồng → Chọn cây → Chăm sóc gần đây → Mẹo theo giai đoạn → Hướng dẫn chi tiết (optional) → Dòng thời gian`

Tapping "Hướng dẫn chi tiết" opens the Stage Playbook screen for the current stage. From there the user can browse forward through stages with "Sắp tới".

### Browse global history

`Nhật ký → Tìm kiếm hoặc lọc → Chọn hoạt động → Chi tiết hoạt động`

### Manage reminders

`Hôm nay hoặc Cài đặt → Thông báo hoặc lịch chăm sóc`

A completed reminder may open a prefilled care-entry form. It does not create history without user confirmation.

## 6. Screen inventory

### Primary destinations

1. Today — “Hôm nay”
2. Plant List — “Cây trồng”
3. Journal — “Nhật ký”
4. Settings — “Cài đặt”

Core and secondary screens:

5. Welcome
6. Create/Edit Plant
7. Plant Detail
8. **Stage Playbook — "Hướng dẫn chi tiết"**
9. Care Entry
10. New Journal Entry — "Thêm nhật ký"
11. Activity or Journal Detail
12. Reminder Management — "Tất cả lời nhắc"
13. Create/Edit Reminder

There is no standalone Task Guidance or guided-task completion screen in MVP.

## 7. Screen specifications

### 7.1 Welcome

**Purpose:** Explain care tracking and stage context, then lead to the first plant.

**Components:** Illustration; “Chăm cây dễ hơn mỗi ngày”; benefits for tracking care, reminders, and stage tips; “Bắt đầu với cây đầu tiên”.

**Empty state:** This is the initial state.

**Loading state:** Show “Đang bắt đầu…” inside the primary button.

**Error state:** Show “Chưa thể bắt đầu. Hãy thử lại.” with “Thử lại”.

**User actions:** Create the first plant; restore or sign in when supported.

### 7.2 Today — “Hôm nay”

**Purpose:** Summarize care that may need attention today across the user's plants.

**Components:**

- Date and greeting.
- “Thời tiết hôm nay”.
- “Việc cần làm hôm nay” with contextual “Tưới nước”, “Bón phân”, and “Phun thuốc” actions when applicable.
- “Vừa ghi gần đây”.
- “Khu Vườn Của Tôi” as horizontally scrollable photo cards with name, species, and current stage; “Thêm cây” stays in the section heading.

Each priority is compact by default: its “Vì sao”, reviewed explanation, and safe guidance expand only on request. Care prompts do not appear as completed/unchecked tasks or in a “Đã xem xét” section.

Each button opens a care form with the plant and activity type prefilled. Nothing is recorded until the user selects “Lưu hoạt động”.

**Empty state:** No plants shows “Bắt đầu với cây đầu tiên của bạn” + “Thêm cây”. No due care shows “Hôm nay chưa có việc đến hạn”.

Hide care buttons that are not relevant rather than filling the page with generic tips.

**Loading state:** Local reminders and recent activity render first. Weather and derived care prompts load independently.

**Error state:** Keep local data. Label stale weather. If care prompts fail, reminders, history, and “Thêm nhật ký” remain available.

**User actions:** Record listed care, add a journal entry with an optional stage change, open a plant, manage a reminder, or review recent activity.

### 7.3 Plant List — “Cây trồng”

**Purpose:** Find a plant and understand its current care status.

**Components:** Search; “Thêm cây”; plant cards with the latest persisted journal photo when available, name, species, stage, last important care, and next reminder. Missing or unreadable photos use the leaf fallback.

**Empty state:** “Mỗi hành trình bắt đầu từ một cây” + “Thêm cây đầu tiên”.

**Loading state:** Plant-card skeletons; preserve local cards.

**Error state:** “Chưa thể tải danh sách cây” + “Thử lại”; local data remains visible when available.

**User actions:** Search, open a plant, or add a plant.

### 7.4 Create or Edit Plant

**Purpose:** Create a plant with enough context for tracking and stage tips.

**Components:** Optional photo; required name; species; current stage; “Lưu cây”.

Optional fields include variety, location, planted date, and notes.

**Empty state:** Clean form focused on the name.

**Loading state:** Show “Đang lưu…” and preserve the draft.

**Error state:** Missing name shows “Hãy đặt tên cho cây”. Missing stage shows “Hãy chọn giai đoạn sinh trưởng”.

**User actions:** Add photo, select species/stage, enter optional details, save, archive, or delete after confirmation.

### 7.5 Plant Detail

**Purpose:** Answer where the plant is now, what care to consider today, and what was saved recently.

Show content in this order:

1. Plant identity using the latest saved journal photo as a rounded hero when available. Overlay the plant name, species, and conditional age metadata on a bottom contrast gradient; otherwise use a compact leaf identity fallback.
2. Compact, horizontally scrollable lifecycle journey designed for all 12 grape stages. This is the single visible current-stage identifier: show the current position count and mark only the confirmed current stage; do not infer completed stages, percentage, countdown, or days in stage.
3. Compact current-stage objective without repeating the stage title, followed by a labelled Stage Playbook action.
4. “Chăm sóc hôm nay” with large watering and fertilizing cards.
5. Informational stage topics and milestones.
6. Weather context.
7. “Nhật ký gần đây” with the three most recent saved journal entries across core care and plant updates.

Each care card shows reviewed recommendation title, growing-method frequency when defined, last saved activity, and deterministic status (`Nên xem xét`, `Chưa cần`, or `Chưa có gợi ý`). Keep the hierarchy compact: place a small activity icon beside the title, render frequency as supporting text without a filled chip, present the info action with secondary emphasis, and group the last activity with its status without a divider. Show the relative last-activity value directly without a redundant “Lần gần nhất” caption; keep the full meaning in the activity link's accessibility label. Missing reviewed frequency shows “Chưa có tần suất đã duyệt”. Status remains derived context, never persisted task state. When reviewed recommendation details exist, the card info action opens a read-only bottom sheet with the approved goal, growing-method frequency, recommended inputs, and notes. Empty optional sections stay absent; the sheet never records care.

A plant-scoped floating action menu is the single record entry point on Plant Detail and opens watering, fertilizing, spraying, and “Thêm nhật ký”. Care cards do not duplicate record buttons. While closed, each action icon changes about every three seconds, sliding from left to right as the button changes to the matching activity color with a brief bounce; it pauses while open and uses a static green create icon when reduced motion is enabled. The control expands with labeled activity icons and changes to a close state while open. Opening a choice does not record history until the user selects “Lưu hoạt động” or “Lưu nhật ký”. The FAB is local to Plant Detail, not global.

Plant Detail displays the first photo from the newest photo-bearing saved Plant Update by occurrence time. When present, the photo uses a 16:9 rounded hero with the plant name and species over a bottom gradient; tapping it opens the uncropped image in a full-screen viewer. The hero scrolls with the page. A missing photo does not create a large placeholder: use the compact leaf identity fallback instead. Note-only updates leave the displayed photo unchanged.

Place the age chip beside the species chip in the wrapping identity metadata row. Current-stage age uses only the persisted time when the current stage became active; planted age uses only the optional planting date. When both values exist, show current-stage age first and switch to planted age every ten seconds with a short vertical slide and crossfade. When only one exists, keep it static; when neither exists, omit the chip. Under reduced motion, show both available labels statically. The visual text may change, but screen readers receive one stable label containing every available value. Never derive stage age from planting date, plant creation date, lifecycle position, authored duration, photos, or care history. Health status remains absent until a persisted source contract exists.

“Nhật ký gần đây” interleaves saved Care Activities and Plant Updates by occurrence time and shows at most three entries. Care rows show the activity icon, title, and time. Plant Update rows show the first saved photo thumbnail when available or a note icon otherwise, plus a note/photo summary and time. Selecting a row opens the matching care or update detail screen. Plant Updates remain journal records rather than dedicated care activities.

**Empty state:** Missing care shows “Chưa có dữ liệu” with the relevant record action. Missing reviewed recommendation shows “Chưa có gợi ý”. Unknown lifecycle or stage remains explicit.

**Loading state:** Plant identity and local care summaries render first. Weather remains independent.

**Error state:** Keep manual tracking available if guidance or weather fails. Label stale weather. Return to Plants if the plant no longer exists.

**User actions:** Review journey and current guidance, open Stage Playbook, open a recent care or plant-update record, record core care through Care Entry, or review recent journal history.

### 7.5.1 Stage Playbook — "Hướng dẫn chi tiết"

**Purpose:** Show a full, stage-focused guidance document. Content is general to the growth stage; it is not personalized to the specific plant.

**Entry point:** "Hướng dẫn chi tiết" link card at the bottom of the tips section in Plant Detail (visible only when a playbook exists for the stage).

**Components:**

- Header: back button + title "Hướng dẫn chi tiết".
- Hero card: stage icon + stage name + estimated duration + "NỘI DUNG CHỜ DUYỆT" badge (dark primary background).
- "Mục tiêu giai đoạn" card: `primaryObjective`.
- "Chăm sóc cần theo dõi" section: one detailed card per stage Care Plan. Each card identifies watering, fertilizing, or spraying and shows its goal, separate ground/container frequency when authored, recommended input categories when authored, and important notes.
- A short statement clarifies that Care Plan content is general to the stage and does not replace assessment of soil, weather, growing method, or the plant's actual condition.
- "Hướng dẫn tham khảo" section: generic informational Care Guides relevant to the stage, including their authored goal and Markdown instructions; these do not represent tracked activities.
- "Nên tìm hiểu" section: `recommendedKnowledgeTopics` bullet list.
- "Tiêu chí hoàn thành giai đoạn" card: `exitCriteria` bullet list with flag icon.
- "Sắp tới" card: next stage from the current stage's authored transition; tapping navigates to Stage Playbook for that stage. This may cross from the final development stage into the production lifecycle.

All content is sourced from authored fields in the preview bundle and remains visibly labeled as review-stage. The screen does not invent frequencies, products, amounts, or plant-specific conclusions.

**Empty state:** Sections with no data are omitted. "Sắp tới" card is hidden only when the current stage has no authored transition or its target has no playbook.

**Loading state:** Not applicable; all knowledge lookups are synchronous from the compiled bundle. The plant record is loaded via TanStack Query; show "Đang tải..." until resolved.

**Error state:** Plant not found shows "Không tìm thấy cây trồng." Stage without playbook shows "Chưa có hướng dẫn cho giai đoạn này."

**User actions:** Read guidance, tap "Sắp tới" to browse the next stage, or tap back to return to Plant Detail.

### 7.6 Journal — “Nhật ký”

**Purpose:** Show saved care and photo/note plant updates across all plants.

**Components:** “Tìm trong ghi chú”; chronological list; filter button; active chips; plant; activity or update details; origin label.

Filters support record type, core care type, plant, date range, and clear/apply actions.

Care-origin labels are “Từ hôm nay”, “Từ lời nhắc”, and “Ghi thủ công”. Origin describes how Care Entry opened; every care record still represents a user-saved activity.

**Empty state:** “Nhật ký của bạn chưa có nội dung” + “Thêm nhật ký”.

No result shows “Không tìm thấy hoạt động phù hợp” + “Xóa bộ lọc”.

**Loading state:** Render local entries immediately; skeleton only uncached pagination.

**Error state:** Preserve cached entries and show inline retry.

**User actions:** Search, filter, open a detail record, or open the plant.

### 7.7 Care Entry

**Purpose:** Save performed watering, fertilizing, or spraying with minimal input.

**Components:** Read-only or preselected activity type; plant; time; keyboard-pinned “Lưu hoạt động”; collapsed “Thêm chi tiết”.

Plant identity uses the latest persisted journal photo when available and falls back to the leaf treatment without blocking the form if photo loading fails.

Watering optional fields include method, amount/unit, notes, and photos.

Fertilizing optional fields include product, fertilizer type, NPK, amount/unit, application method, notes, and photos.

Spraying optional fields include product, purpose, dosage/unit, method, notes, and photos.

When opened from Today, Plant Detail, or a reminder, relevant fields are prefilled and clearly editable. Saving remains required.

**Empty state:** Without a plant, show “Hãy thêm cây trước khi ghi hoạt động” + “Thêm cây”.

**Loading state:** Show “Đang lưu…” only in Save. Upload photos independently.

**Error state:** Preserve all values. Show field errors locally. Mark individual failed photos with retry/remove actions.

**User actions:** Confirm plant/time, add optional detail/photos, save, or close with unsaved-change confirmation.

After save, show “Đã lưu · Hoàn tác”. Optionally suggest a reminder with “7 ngày”, “14 ngày”, “30 ngày”, or “Không nhắc”.

### 7.8 New Journal Entry — “Thêm nhật ký”

**Purpose:** Record a visual or written update about a plant without forcing it into a care activity type.

**Components:** Plant; date/time; prominent “Thêm ảnh”; optional “Ghi chú”; “Giai đoạn hiện tại”; secondary “Thay đổi”; keyboard-pinned “Lưu nhật ký”.

The note may describe pruning, an observation, growth, fruit development, damage, or any other update. These concepts are not separate activity selectors.

Show the confirmed stage, such as “Giai đoạn hiện tại: Nuôi thân”. Selecting “Thay đổi” opens the species-defined stage list. Saving a changed stage creates one stage-history record with the journal entry.

**Empty state:** Show the photo and note controls immediately. Without a plant, require plant selection before Save.

**Loading state:** Show “Đang lưu…” only in Save. Upload photos independently after the local entry is saved.

**Error state:** Preserve the note, stage selection, and local photo references. Show failed uploads individually with retry/remove actions.

**User actions:** Select a plant, take or choose photos, write a note, optionally change stage, change time, save, or close with unsaved-change confirmation.

### 7.9 Activity or Journal Detail

**Purpose:** Review and correct one saved care activity or plant update.

**Components:** Record type, plant, date/time, origin, optional care details, notes, photos, “Chỉnh sửa”, and delete menu.

**Empty state:** Not applicable; an existing entry is required.

**Loading state:** Skeleton metadata/content and image placeholders.

**Error state:** If deleted elsewhere, show “Hoạt động này không còn tồn tại” and return to the source list.

**User actions:** Edit, view photos, delete after confirmation, or open the plant.

### 7.10 Care Plan schedule settings

**Purpose:** Customize schedule snapshots without editing curated Care Plan knowledge or creating manual care tasks.

**Navigation:** `Cài đặt` exposes three destinations: “Thông báo”, “Kế hoạch chăm sóc theo giai đoạn”, and “Tùy chỉnh theo cây”.

**Stage settings:** List every authored stage and its Care Plans. A stage snapshot belongs to one exact Care Plan. Ground and container each show their authored frequency and may set an independent interval; notification delivery and time are shared by both growing methods. Reset restores both authored frequencies.

**Plant settings:** Select a plant first. Active current-stage Care Plans show their effective source. Saving copies a complete effective schedule into a plant snapshot. “Dùng tất cả cài đặt theo giai đoạn” deletes that snapshot. Inactive retained snapshots appear under “Giai đoạn khác”.

**Notification behavior:** Delivery defaults off. Enabling delivery requests OS permission and uses 08:00 when no time exists. Disabled delivery never hides due care from Today. A main notification and at most one next-day follow-up may be delivered; neither writes care history.

**Empty state:** A stage without Care Plans shows “Chưa có kế hoạch chăm sóc đã duyệt cho giai đoạn này.” A user with no plants sees the existing add-plant path.

**Error state:** Preserve local drafts and show “Chưa thể lưu tùy chỉnh. Dữ liệu đã nhập vẫn được giữ lại.” Permission denial still preserves in-app schedule behavior.

### 7.11 Settings — “Cài đặt”

**Purpose:** Configure shipped notification and Care Plan schedule behavior.

**Components:**

- “Thông báo”
- “Kế hoạch chăm sóc theo giai đoạn”
- “Tùy chỉnh theo cây”

**Empty state:** Not applicable; only shipped settings appear.

**Loading state:** Render local settings immediately.

**Error state:** Keep errors inside the affected row.

**User actions:** Review notification permission, customize stage schedules, or customize one plant schedule.

## 8. Shared interaction patterns

### Save and undo

- Use “Lưu hoạt động”, “Lưu cây”, and “Lưu lời nhắc”.
- After save, close the form and show “Đã lưu · Hoàn tác”.
- Never use a blocking success screen for routine activity saving.

### Tips and Today care prompts

- Tips are static informational rows inside Plant Detail.
- Care prompts use direct labels such as “Tưới nước”.
- Care prompts never show a completed checkbox.
- Ignoring a prompt does not alter history.

### Stage confirmation

- Show the current confirmed stage in New Journal Entry without requiring interaction.
- A manual change is applied only when “Lưu nhật ký” succeeds.
- Future AI may show “Có vẻ cây đang ở giai đoạn Ra hoa. Cập nhật?” after photo analysis.
- AI output is a suggestion only. The user must select the stage and confirm the journal save.

### Search and filters

- Preserve Journal filters while Activity Detail is open.
- Show active filters as removable chips.
- Provide “Xóa bộ lọc” when no results match.

### Photos and destructive actions

- One failed photo never fails an activity.
- Confirm deletion with the plant/activity name.
- Prefer archive for plants with history.

## 9. Navigation rationale

Today, Plants, Journal, and Settings remain persistent destinations. Actions live on Today and Plant Detail, where the plant and care context are visible.

No global FAB avoids duplicating Today actions. Plant Detail alone may use one plant-scoped floating action menu because plant context is already fixed; it opens Care Entry or “Thêm nhật ký” and never writes history directly.

Journal is justified by cross-plant activity history, but prototype research should confirm it remains frequent enough for a tab.

Reminders stay secondary because users encounter them through daily care or one plant's context.

## 10. Visual language

Follow `docs/design/DESIGN.md` for tokens, typography, spacing, components, and mockup exceptions.

## 11. Accessibility

- Support Dynamic Type without clipping.
- Meet WCAG AA contrast.
- Never encode care status using color alone.
- Give icon-only controls accessible Vietnamese labels.
- Preserve focus across sheets and forms.
- Respect reduced motion.

## 12. Feature priority

**P0:** Plant creation, contextual care entry, Plant Dashboard care summaries, stage tips, photo journal with optional stage update, Timeline, reminders, weather context, and four-tab navigation.

**P1:** Rich activity details, Journal search/filters, improved care prompts, archive, export, backup/restore, runtime language selection, alternate language catalogs, and theme.

Current UI remains Vietnamese-only. Application chrome uses typed translation keys so future catalogs can replace copy without another screen-by-screen extraction. Curated Knowledge Base content keeps its separate locale and review contract.

**P2:** Recurrence, additional species, collaboration, analytics, diagnostics, AI, premium capabilities, and connected devices.

## 13. Prototype success criteria

At least four of five target users can:

- find the last watering and fertilizing date for a plant;
- record watering in under 20 seconds;
- record fertilizer product and amount when desired;
- distinguish a stage tip from a trackable activity;
- open care entry from Today and understand nothing is saved yet;
- add a plant photo and note without selecting an activity type;
- update a plant's growth stage while saving a journal entry;
- find a saved activity in Plant Timeline and Journal;
- create a reminder for future care;
- understand that weather is context, not a guaranteed instruction.
