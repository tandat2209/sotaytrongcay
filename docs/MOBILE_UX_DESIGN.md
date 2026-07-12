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
- Reminders remain secondary to Today, Plant Detail, and Me.

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
- Browse to a full-stage playbook guide ("Hướng dẫn chi tiết") with care guide and forward browsing to the next stage.
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
4. **Tôi** — preferences, reminders, data tools, and support.

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

`Hôm nay hoặc Tôi → Tất cả lời nhắc → Tạo, hoàn thành hoặc hoãn`

A completed reminder may open a prefilled care-entry form. It does not create history without user confirmation.

## 6. Screen inventory

### Primary destinations

1. Today — “Hôm nay”
2. Plant List — “Cây trồng”
3. Journal — “Nhật ký”
4. Me — “Tôi”

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
- Plant selector/context.

Each priority is compact by default: its “Vì sao”, reviewed explanation, and safe guidance expand only on request. Care prompts do not appear as completed/unchecked tasks or in a “Đã xem xét” section.

Each button opens a care form with the plant and activity type prefilled. Nothing is recorded until the user selects “Lưu hoạt động”.

**Empty state:** No plants shows “Bắt đầu với cây đầu tiên của bạn” + “Thêm cây”. No due care shows “Hôm nay chưa có việc đến hạn”.

Hide care buttons that are not relevant rather than filling the page with generic tips.

**Loading state:** Local reminders and recent activity render first. Weather and derived care prompts load independently.

**Error state:** Keep local data. Label stale weather. If care prompts fail, reminders, history, and “Thêm nhật ký” remain available.

**User actions:** Record listed care, add a journal entry with an optional stage change, open a plant, manage a reminder, or review recent activity.

### 7.3 Plant List — “Cây trồng”

**Purpose:** Find a plant and understand its current care status.

**Components:** Search; “Thêm cây”; plant cards with photo, name, species, stage, last important care, and next reminder.

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

**Purpose:** Answer when important care happened and provide concise stage context.

**Components:** Plant identity; current stage; edit; “Thêm nhật ký”.

Show “Chăm sóc gần đây” first:

- “Tưới nước” — last date/time and “Ghi tưới nước”.
- “Bón phân” — last date/time/product and “Ghi bón phân”.
- “Phun thuốc” — last date/time/product and “Ghi phun thuốc”.
- “Lời nhắc tiếp theo”.

Then show “Mẹo cho giai đoạn này”:

- Concise things to do.
- Things to avoid.
- Warning signs.
- Upcoming milestone.

Tips are plain informational rows. They have no checkbox, completion state, reminder, or automatic journal behavior.

Show weather context and “Hoạt động gần đây” after care and tips. Timeline remains available as a secondary section.

**Empty state:** Missing care shows “Chưa có dữ liệu” with the relevant record action. Missing tips show “Chưa có mẹo cho giai đoạn này”.

**Loading state:** Plant identity and local care summaries render first. Tips, weather, and history load independently.

**Error state:** Keep manual tracking available if tips or weather fail. Label stale weather. Return to Plants if the plant no longer exists.

**User actions:** Record core care, add a journal entry with an optional stage change, open last activity, manage reminder, read tips, open Stage Playbook for the full guide, edit the plant, or review Timeline.

### 7.5.1 Stage Playbook — "Hướng dẫn chi tiết"

**Purpose:** Show a full, stage-focused guidance document. Content is general to the growth stage; it is not personalized to the specific plant.

**Entry point:** "Hướng dẫn chi tiết" link card at the bottom of the tips section in Plant Detail (visible only when a playbook exists for the stage).

**Components:**

- Header: back button + title "Hướng dẫn chi tiết".
- Hero card: stage icon + stage name + estimated duration + "NỘI DUNG CHỜ DUYỆT" badge (dark primary background).
- "Mục tiêu giai đoạn" card: `primaryObjective`.
- "Thao tác quan trọng" section: care guide "Nên làm" card when a guide exists for the stage.
- "Lưu ý chăm sóc" section: care recommendations relevant to the stage.
- "Nên tìm hiểu" section: `recommendedKnowledgeTopics` bullet list.
- "Tiêu chí hoàn thành giai đoạn" card: `exitCriteria` bullet list with flag icon.
- "Sắp tới" card: next stage (derived by sequence + 1 within lifecycle); tapping navigates to Stage Playbook for the next stage.

All content is sourced from the preview bundle. No fabricated care frequencies or fertilizer formulas are shown.

**Empty state:** Sections with no data are omitted. "Sắp tới" card is hidden for the last stage in a lifecycle.

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

### 7.10 Reminder Management — “Tất cả lời nhắc”

**Purpose:** Manage future care without using a primary navigation slot.

**Components:** “Quá hạn”, “Sắp tới”, “Đã hoàn thành”; plant; core care type; time; “Tạo lời nhắc”.

Completing a core-care reminder offers “Ghi hoạt động” and opens prefilled Care Entry. It does not write history automatically.

**Empty state:** “Chưa có lời nhắc nào” + “Tạo lời nhắc”.

**Loading state:** Row skeletons while create remains available.

**Error state:** Preserve local reminders and show inline retry or sync status.

**User actions:** Create, edit, snooze, mark reminder complete, or record the related activity.

### 7.11 Create or Edit Reminder

**Purpose:** Schedule a future care prompt.

**Components:** Core care type; required plant; required date/time; optional note; notification toggle; “Lưu lời nhắc”.

**Empty state:** Default to the next sensible future time; do not guess the core care type.

**Loading state:** Show progress inside Save and explain notification permission before the system prompt.

**Error state:** Past time suggests “Đặt vào ngày mai”. Denied permission still allows in-app saving.

**User actions:** Select activity, plant, and time; toggle notification; save, edit, or delete.

### 7.12 Me — “Tôi”

**Purpose:** Own preferences, reminder management, data tools, and support.

**Components:**

- “Cài đặt”
- “Thông báo”
- “Lời nhắc”
- “Sao lưu & khôi phục”
- “Xuất dữ liệu”
- “Ngôn ngữ”
- “Giao diện”
- “Giới thiệu”
- “Gửi phản hồi”

Do not show unavailable future capabilities as disabled placeholders.

**Empty state:** Not applicable; only shipped capabilities appear.

**Loading state:** Render local preferences immediately; load account and sync status independently.

**Error state:** Keep errors inside the affected row.

**User actions:** Manage preferences, reminders, notifications, backup, export, language, theme, help, and feedback.

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

Today, Plants, Journal, and Me remain persistent destinations. Actions live on Today and Plant Detail, where the plant and care context are visible.

Removing the FAB avoids duplicating the buttons already shown under “Việc cần làm hôm nay” and prevents unimportant subactivities from appearing equal to core care.

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

**P1:** Rich activity details, Journal search/filters, improved care prompts, archive, export, backup/restore, language, and theme.

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
