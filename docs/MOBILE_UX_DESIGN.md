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
- Today and Plant Detail expose single-plant care, journal, and stage actions.
- Plant List exposes one explicit multi-select action for care that was performed for several Plants.
- Reminders remain secondary to Today, Plant Detail, and “Mở rộng”.

### Mobile-first

- Use minimum 44 × 44 point targets.
- Keep frequent actions within thumb reach.
- Use bottom sheets for short care forms and filters.
- Preserve drafts after validation, offline, or upload errors.
- Render local history before remote work.

### Trustworthy context

- All visible product text is Vietnamese.
- Weather keeps source time and freshness internally; the visible summary is compact and icon-led, with stale status exposed as an accessible icon state.
- Weather asks before using foreground location, stores a coarse app-level weather location, and remains display-only.
- Measurements show their user, device, or provider source.
- Suggestions never imply that an activity happened.
- Product, dosage, and disease guidance requires approved knowledge.

## 3. MVP UX scope

- Create and edit plants.
- Set the current species-defined growth stage.
- Track watering, fertilizing, and spraying.
- Record one shared watering, fertilizing, or spraying event for several selected Plants.
- Add photo-and-note journal entries for pruning, observations, growth, and other updates.
- Attach optional structured details, notes, and photos.
- View last care and next reminder for each plant.
- View stage tips, entry criteria overview, and exit criteria.
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
4. **Mở rộng** — fertilizer management, notification, and Care Plan schedule configuration.

There is no central action layered over the navigation. Each action appears where the user has enough plant and care context to understand its result.

## 5. Core flows

### First use

`Chào mừng → Tạo cây đầu tiên → Chọn giai đoạn → Chi tiết cây`

### Record routine care

`Hôm nay → Việc cần làm hôm nay → Tưới nước, Bón phân hoặc Phun thuốc → Nhập chi tiết tùy chọn → Lưu hoạt động`

Shortest watering path:

`Hôm nay → Tưới nước → Lưu hoạt động`

Fertilizing with an optional fertilizer identity:

`Hôm nay hoặc Chi tiết cây → Bón phân → Thêm loại phân → Chọn hoặc thêm phân bón → Lưu hoạt động`

Selecting, adding, or removing a fertilizer only changes the in-memory Care Entry draft. Returning from the selection sheet restores the parent draft. Only “Lưu hoạt động” writes the fertilizing activity and its selected fertilizer identities.

Care Entry is the first route to fertilizer selection and creation: `Bón phân → Thêm loại phân`. The persistent second route is `Mở rộng → Quản lý phân bón`. Creating or editing a reusable fertilizer from either route updates the private fertilizer catalog but does not create a Care Activity.

### Record care for several plants

`Cây trồng → Chọn nhiều → Chọn ít nhất hai cây → Tiếp tục → Tưới nước, Bón phân hoặc Phun thuốc → Nhập chi tiết chung → Xác nhận → Lưu cho {count} cây`

“Chọn nhiều” enters a temporary selection mode local to Plant List. Plant rows expose accessible selected state, tapping a row toggles it instead of opening Plant Detail, and the pinned “Tiếp tục ({count})” action remains disabled until two active Plants are selected. Cancel exits selection mode without changing history.

The activity choice opens a focused batch Care Entry outside the persistent tabs. Occurrence time, watering intensity, optional per-Plant estimated liters, fertilizer identities, spraying target, and notes apply independently to every selected Plant. The amount label states “Lượng nước ước tính mỗi cây”; the app never treats the entered value as a total or divides it. Batch fertilizing retains access to “Phân bón của tôi” but omits stage-specific Knowledge Base suggestions. A spraying target is available only when it applies to every selected Plant species.

Confirmation shows the activity, time, shared details, selected count, and every Plant name. “Lưu cho {count} cây” atomically creates one ordinary Care Activity per Plant with independent IDs and copied Fertilizer Applications where applicable. A failure creates no partial journal history and preserves the draft. The saved records remain independently editable and visible in each Plant's history and the global Journal. No persistent batch entity is created.

### Add a plant update or change stage

`Hôm nay hoặc Chi tiết cây → Thêm nhật ký → Chọn cây nếu cần → Thêm ảnh + ghi chú → Giữ hoặc thay đổi giai đoạn → Lưu nhật ký`

Pruning, observations, growth, and general updates may be described here without becoming separate activity types. Stage selection is optional and defaults to the confirmed current stage.

### Review one plant

`Cây trồng → Chọn cây → Chăm sóc gần đây → Mẹo theo giai đoạn → Hướng dẫn chi tiết (optional) → Dòng thời gian`

Tapping "Hướng dẫn chi tiết" opens the Stage Playbook screen for the current stage. From there the user can browse forward through stages with "Sắp tới".

### Browse global history

`Nhật ký → Tìm kiếm hoặc lọc → Chọn hoạt động → Chi tiết hoạt động`

### Manage reminders

`Hôm nay hoặc Mở rộng → Thông báo hoặc lịch chăm sóc`

A completed reminder may open a prefilled care-entry form. It does not create history without user confirmation.

## 6. Screen inventory

### Primary destinations

1. Today — “Hôm nay”
2. Plant List — “Cây trồng”
3. Journal — “Nhật ký”
4. More — “Mở rộng”

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
14. Fertilizer Management — “Quản lý phân bón”
15. Create/Edit User Fertilizer — “Thêm phân bón” / “Chỉnh sửa phân bón”

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

- App logo and name without a repeated “Hôm nay” page heading; the date and greeting form the first row inside the weather card.
- Compact weather summary.
- “Việc cần làm hôm nay” with contextual “Tưới nước”, “Bón phân”, and “Phun thuốc” actions when applicable.
- “Vừa ghi gần đây”.
- “Cây của tôi” as horizontally scrollable photo cards with name, species, and current stage; “Thêm cây” stays in the section heading.

Each priority is compact by default: its “Vì sao”, reviewed explanation, and safe guidance expand only on request. Care prompts do not appear as completed/unchecked tasks or in a “Đã xem xét” section.

Rank and limit the three most urgent activity prompts before grouping them by plant. Render one plant card with `PlantIdentity` once, followed by a separate row for each included activity. Each row keeps its own due status, expandable explanation, and care action. Pressing the plant identity opens Plant Detail; pressing an activity control affects only that activity.

Each button opens a care form with the plant and activity type prefilled. Nothing is recorded until the user selects “Lưu hoạt động”.

The weather card initially explains that data is unavailable and offers “Dùng vị trí hiện tại”. After foreground permission, it shows no standalone title: a semantic condition icon and label lead compact icon-and-value groups for temperature, humidity, rain chance, and wind. The overview does not show the saved location, observation time, provider, freshness wording, or an update-location action. Metric icons retain full Vietnamese accessibility labels, and stale data uses an accessible status icon. Weather never changes the cards under “Việc cần làm hôm nay”.

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

When at least two active Plants exist, “Chọn nhiều” is also available. Selection mode replaces open affordances with check controls and adds the pinned “Tiếp tục ({count})” action. Archived Plants never appear or receive batch care.

### 7.4 Create or Edit Plant

**Purpose:** Create a plant with enough context for tracking and stage tips.

**Components:** One optional photo; required name; icon-led “Chậu” or “Đất” growing-method choices; optional planted date; a current-stage selector backed by the complete species-defined stage list; “Lưu cây”. Do not show the free-text plant location field in this flow.

An optional setup photo is saved as a photo-only initial Plant Update at the selected stage, not as a separate Plant-owned photo. If photo persistence fails, keep the form draft and do not leave a partially created plant.

**Empty state:** Clean form focused on the name.

**Loading state:** Show “Đang lưu…” and preserve the draft.

**Error state:** Missing name shows “Hãy đặt tên cho cây”. Missing stage shows “Hãy chọn giai đoạn sinh trưởng”.

**User actions:** Add or remove a photo, choose the growing method, select the current stage, enter the optional planted date, and save.

Editing an existing Plant changes its required name, growing method, and optional planted date. The grower may clear a previously saved planted date. Stage changes remain in “Thêm nhật ký” so the confirmed transition and stage-start time stay in history; editing does not directly replace the current stage. Plant-owned photos do not exist, so a new representative photo also remains a Plant Update rather than an editable profile field.

Plant Detail's overflow menu contains “Chỉnh sửa cây” and “Lưu trữ cây”. Archiving requires confirmation, hides the Plant from active lists, Today, settings, new-entry flows, and reminders, and preserves its existing care and journal records with their Plant identity. An archived Plant cannot receive new records. Existing Care Activities remain viewable and editable from Journal. Restore and permanent deletion are outside this slice.

### 7.5 Plant Detail

**Purpose:** Answer where the plant is now, what care to consider today, and what was saved recently.

Show content in this order:

1. Plant identity using the latest saved journal photo as a rounded hero when available. Overlay the plant name, species, and conditional age metadata on a bottom contrast gradient; otherwise use a compact leaf identity fallback.
2. Compact, horizontally scrollable lifecycle journey designed for all 12 grape stages. Initially center the confirmed current stage when the journey has enough content on both sides; clamp the first and last stages to the available scroll boundaries. This is the single visible current-stage identifier: show the current position count and mark only the confirmed current stage; do not infer completed stages, percentage, countdown, or days in stage.
3. Compact current-stage objective without repeating the stage title, followed by a labelled Stage Playbook action.
4. “Chăm sóc hôm nay” with large watering and fertilizing cards.
5. Weather context.
6. “Nhật ký gần đây” with the three most recent saved journal entries across core care and plant updates.

Each care card shows reviewed recommendation title, growing-method frequency when defined, last saved activity, and deterministic status (`Nên xem xét`, `Chưa cần`, or `Chưa có gợi ý`). Keep the hierarchy compact: place a small activity icon beside the title, render frequency as supporting text without a filled chip, present the info action with secondary emphasis, and group the last activity with its status without a divider. Pressing the activity identity and frequency opens Care Entry with the plant and activity type prefilled; it never saves directly. The guide action remains read-only, while the last-activity value continues to open that saved record. Show the relative last-activity value directly without a redundant “Lần gần nhất” caption; keep the full meaning in the activity link's accessibility label. Missing reviewed frequency shows “Chưa có tần suất đã duyệt”. Status remains derived context, never persisted task state. When reviewed recommendation details exist, the card info action opens a read-only bottom sheet with the approved goal, growing-method frequency, recommended inputs, optional stage-specific fertilizer-group guidance, and notes. Group guidance uses the canonical Vietnamese group label plus authored explanation and states that it does not confirm deficiency or an immediate need to fertilize. Empty optional sections stay absent; the sheet never records care.

A plant-scoped radial action menu remains the complete record entry point on Plant Detail and opens watering, fertilizing, spraying, and “Thêm nhật ký”. The visible watering and fertilizing cards also provide contextual shortcuts to their matching Care Entry without adding record buttons. Its closed button is centered above the bottom navigation and cycles through the four action icons and semantic colors about every three seconds with a short horizontal slide and restrained bounce. Pressing it dims the current screen, pauses cycling, and moves the four labelled actions outward from the center onto a rounded upward arc around a fixed close button at the same bottom-center anchor. Tapping outside or pressing close dismisses the menu. Reduced motion uses a static green create icon and presents the open state without animation. Opening any entry point does not record history until the user selects “Lưu hoạt động” or “Lưu nhật ký”. The radial action menu is local to Plant Detail, not global.

Plant Detail displays the first photo from the newest photo-bearing saved Plant Update by occurrence time. When present, the photo uses a 16:9 rounded hero with the plant name and species over a bottom gradient; tapping it opens the uncropped image in a full-screen viewer. The hero scrolls with the page. A missing photo does not create a large placeholder: use the compact leaf identity fallback instead. Note-only updates leave the displayed photo unchanged.

Place the age chip beside the species chip in the wrapping identity metadata row. Current-stage age uses only the persisted time when the current stage became active; planted age uses only the optional planting date. When both values exist, show current-stage age first and switch to planted age every ten seconds with a short vertical slide and crossfade. When only one exists, keep it static; when neither exists, omit the chip. Under reduced motion, show both available labels statically. The visual text may change, but screen readers receive one stable label containing every available value. Never derive stage age from planting date, plant creation date, lifecycle position, authored duration, photos, or care history. Health status remains absent until a persisted source contract exists.

“Nhật ký gần đây” interleaves saved Care Activities and Plant Updates by occurrence time and shows at most three entries. Care rows show the activity icon, title, and time. Plant Update rows show the first saved photo thumbnail when available or a note icon otherwise, plus a note/photo summary and time. Selecting a row opens the matching care or update detail screen. Plant Updates remain journal records rather than dedicated care activities.

Plant Detail reuses the same compact app-level weather summary as Today. Setup and retry actions appear only when weather is unavailable; available weather has no location-update action. Weather never changes Plant Detail care status, schedule, reminder, or saved history in the current scope.

**Empty state:** Missing care shows “Chưa có dữ liệu” with the relevant record action. Missing reviewed recommendation shows “Chưa có gợi ý”. Unknown lifecycle or stage remains explicit.

**Loading state:** Plant identity and local care summaries render first. Weather remains independent.

**Error state:** Keep manual tracking available if guidance or weather fails. Label stale weather. Return to Plants if the plant no longer exists.

**User actions:** Review journey and current guidance, open Stage Playbook, open a recent care or plant-update record, record core care through Care Entry, review recent journal history, edit profile information, or archive the Plant after confirmation.

### 7.5.1 Stage Playbook — "Hướng dẫn chi tiết"

**Purpose:** Show a full, stage-focused guidance document. Content is general to the growth stage; it is not personalized to the specific plant.

**Entry point:** "Hướng dẫn chi tiết" link card at the bottom of the tips section in Plant Detail (visible only when a playbook exists for the stage).

**Components:**

- Header: back button + title "Hướng dẫn chi tiết".
- Hero card: the optional authored stage illustration with a bottom contrast gradient, stage icon + stage name + estimated duration + `primaryObjective`. It falls back to the dark primary treatment when the image is absent or unreadable; it is a general illustration, not a user-plant photo or stage confirmation.
- "Chăm sóc cần theo dõi" section: one initially collapsed card per stage Care Plan. Its activity icon and title identify the care; expanding it reveals the goal, separate ground/container frequency when authored, recommended inputs, optional stage-specific fertilizer-group guidance, and important notes. Group guidance derives its label from the canonical taxonomy and includes the same deficiency/immediate-use disclaimer as Plant Detail.
- A short statement clarifies that Care Plan content is general to the stage and does not replace assessment of soil, weather, growing method, or the plant's actual condition.
- "Hướng dẫn bổ sung" section: one initially collapsed card per generic informational Care Guide. Opening a card shows its authored goal and Markdown instructions; these do not represent tracked activities.
- "Sâu bệnh cần theo dõi" section: collapsed, read-only Pest and Disease cards whose authored species and monitoring-stage relationships match the playbook. It carries an explicit observation-only disclaimer and expands to the authored content. It is omitted when no target matches; it never creates a diagnosis, spraying instruction, reminder, recommendation card, entry prefill, or history.
- "Tiêu chí hoàn thành giai đoạn" card: `exitCriteria` bullet list with flag icon.
- "Sắp tới" card: next stage from the current stage's authored transition; tapping navigates to Stage Playbook for that stage. This may cross from the final development stage into the production lifecycle.

All content is sourced from authored fields in the preview bundle and remains visibly labeled as review-stage. The screen does not invent frequencies, products, amounts, or plant-specific conclusions.

**Empty state:** Sections with no data are omitted. "Sắp tới" card is hidden only when the current stage has no authored transition or its target has no playbook.

**Loading state:** Not applicable; all knowledge lookups are synchronous from the compiled bundle. The plant record is loaded via TanStack Query; show "Đang tải..." until resolved.

**Error state:** Plant not found shows "Không tìm thấy cây trồng." Stage without playbook shows "Chưa có hướng dẫn cho giai đoạn này."

**User actions:** Read guidance, tap "Sắp tới" to browse the next stage, or tap back to return to Plant Detail.

### 7.6 Journal — “Nhật ký”

**Purpose:** Show saved care and photo/note plant updates across all plants.

**Components:** Transforming top-bar search; chronological list; filter button with active indicator; plant; activity or update details; origin label.

Filters support record type, core care type, plant, date range, and clear/apply actions.

Keep search and filtering in the top bar rather than in the scrolling page. In the default state, show the Journal title and icon followed by the search icon and filter icon. Pressing search replaces the title and Journal icon with an auto-focused “Tìm trong ghi chú” field; the filter icon remains available. Closing search clears its query and restores the title. The filter icon opens the complete filter sheet and shows a persistent active indicator while any filter is applied.

Care-origin labels are “Từ hôm nay”, “Từ lời nhắc”, and “Ghi thủ công”. Origin describes how Care Entry opened; every care record still represents a user-saved activity.

**Empty state:** “Nhật ký của bạn đang trống” + “Thêm nhật ký”.

No result shows “Không tìm thấy nội dung phù hợp” + “Xóa bộ lọc”.

**Loading state:** Render local entries immediately; skeleton only uncached pagination.

**Error state:** Preserve cached entries and show inline retry.

**User actions:** Search, filter, open a detail record, or open the plant.

### 7.7 Care Entry

**Purpose:** Save performed watering, fertilizing, or spraying with minimal input.

**Components:** Read-only or preselected activity type; plant; time; keyboard-pinned “Lưu hoạt động”; collapsed “Thêm chi tiết”. The parent fertilizing sheet shows selected fertilizer chips and “Thêm”; one focused add sheet owns recent selection, catalog search, and compact creation.

Plant identity uses the latest persisted journal photo when available and falls back to the leaf treatment without blocking the form if photo loading fails.

Watering first shows four one-tap intensity choices: “Tưới nhẹ — làm ẩm bề mặt đất”, “Tưới vừa — tưới đủ ẩm vùng rễ”, “Tưới đẫm — tưới kỹ đến khi đất ẩm sâu”, and “Mưa — cây được tưới tự nhiên”. Selection updates visible and accessible radio state; “Lưu hoạt động” remains the only persistence action.

Optional estimated liters and notes stay hidden under collapsed “Thêm chi tiết”. The app never prefills estimated liters or derives volume from intensity. Legacy watering rows without intensity show “Chưa ghi mức tưới” rather than inferred intensity.

Fertilizing requires no product detail. The parent sheet keeps plant context, occurrence time, an optional activity note, and zero or more selected fertilizer identities. Selected fertilizers appear as toggleable chips beside “Thêm loại phân”. Tapping “Thêm” opens one fertilizer selection sheet. Its default view shows up to five fertilizers ordered by latest saved use so repeat selection is one tap. A search icon reveals name search across all of “Phân bón của tôi”. Search results and recent items use compact `group · name` chips when a group exists. A repeated name from recent user history is a convenience, not approved guidance or a default selection.

Inside the selection sheet, “Thêm phân bón” switches to one compact `name | group | confirm` row plus a close action. The group select initially shows “Nhóm”; tapping it reveals a vertical option menu directly below with exactly “Phân hữu cơ”, “Phân giàu đạm”, “NPK cân bằng”, “Phân giàu lân”, “Phân giàu kali”, “Chế phẩm hỗ trợ”, and “Phân khác”. Choosing one collapses the menu and displays that same group everywhere the fertilizer appears. Require both a non-empty name and one group before enabling the confirmation icon. Do not ask for a second fertilizer type or recommendation group. Do not use the full standalone management form or a large primary button here. Saving the new catalog item selects it and returns to the parent draft. Selecting any existing fertilizer does the same. No subsequent application editor opens. The MVP does not collect quantity, unit, application method, or item-specific notes; retained nullable persistence fields exist only for backward-compatible history. Removing an item from the draft does not delete its reusable fertilizer record.

When the applicable approved Care Plan contains structured fertilizer suggestions, show each suggestion as an inline selectable chip under “Đã dùng loại phân nào?”. Each concrete suggestion has one canonical group from the same seven-value taxonomy; there is no separate recommendation-group heading. Chips wrap naturally across lines, with approximately two or three per normal mobile row depending on label length; never use horizontal scrolling. Tapping an unselected chip creates or reuses the stable-ID-linked fertilizer in “Phân bón của tôi” and adds it to the in-memory draft without opening the nested editor. Tapping it again removes only the draft selection. Catalog persistence does not create care history; “Lưu hoạt động” remains the only history-write action. Under a suggestion, show its newest saved use as “Đã bón cho “{plant}” {days} ngày trước” or “Đã bón cho “{plant}” hôm nay”. Never derive this status from an unsaved draft. “Thêm loại phân” remains available for a fertilizer outside the suggestions.

Use “Thêm chi tiết” for the optional activity note and “Thêm loại phân” to open the single recent/search/create selection sheet. “Mở rộng” remains the fourth persistent tab and never labels a save action.

Spraying shows “Vấn đề muốn xử lý (không bắt buộc)” as a species-filtered, single-select group of curated pest and disease chips when catalog entries exist. Supporting text states that the selection records the target of the spraying event and is not a diagnosis. Tapping the selected chip clears it. The selector is hidden when an older Knowledge Base bundle has no target catalog, and saving remains available.

The saved target name may appear as secondary context in Journal, Today recent history, Plant Detail recent history, and as a conditional “Vấn đề muốn xử lý” row in Activity Detail. Older spraying records keep generic spraying text. Product, purpose, dosage/unit, method, a free-text target, target guidance, and multiple targets remain future optional details; notes and photos keep their existing generic Care Entry behavior.

When opened from Today, Plant Detail, or a reminder, relevant fields are prefilled and clearly editable. Saving remains required.

When opened for several Plants, Care Entry uses a selected-Plant summary instead of one Plant identity and omits Plant- or stage-specific recommendation context. The final confirmation, not opening or completing the form, is the history-write boundary.

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

**Navigation:** `Mở rộng` exposes “Thông báo”, “Chăm sóc theo giai đoạn”, and “Tùy chỉnh theo cây”.

**Stage settings:** List every authored stage. Its detail is the shared Stage Playbook. Each tracked Care Plan keeps its read-only authored “Tần suất tham khảo” and adds a compact “Lịch của bạn” editor for its stage schedule snapshot: “Trồng đất · Mỗi [n] ngày” and “Trồng chậu · Mỗi [n] ngày”. A compact right-aligned save icon saves the complete draft; keyboard submit invokes the same save when available. Ground and container each show their authored frequency and may set an independent interval; notification delivery and time are shared by both growing methods. Reset restores both authored frequencies.

**Plant settings:** Select a plant first. Active current-stage Care Plans show their effective source. Saving copies a complete effective schedule into a plant snapshot. “Dùng tất cả cài đặt theo giai đoạn” deletes that snapshot. Inactive retained snapshots appear under “Giai đoạn khác”.

**Notification behavior:** Delivery defaults off. Enabling delivery requests OS permission and uses 08:00 when no time exists. Every enabled applicable schedule registers its future main notification and at most one next-day follow-up as soon as the due date can be derived, so the OS can deliver them while the app is closed. A received notification remains visible in the banner and notification list while the app is open. Disabled delivery never hides due care from Today, and neither notification writes care history. The standalone “Thông báo” screen reports device permission only and explains that “Gửi thông báo” remains a per-schedule choice.

**Empty state:** A stage without Care Plans shows “Chưa có kế hoạch chăm sóc đã duyệt cho giai đoạn này.” A user with no plants sees the existing add-plant path.

**Error state:** Preserve local drafts and show “Chưa thể lưu tùy chỉnh. Thông tin bạn đã nhập vẫn còn nguyên.” Permission denial still preserves in-app schedule behavior.

### 7.11 More — “Mở rộng”

**Purpose:** Provide one persistent place for secondary management and configuration destinations.

**Components:**

- “Quản lý phân bón”
- “Thông báo”
- “Chăm sóc theo giai đoạn”
- “Tùy chỉnh theo cây”
- “Lưu ý sử dụng”

“Quản lý phân bón” separates “Phân bón của tôi” from “Gợi ý từ hướng dẫn”. The private section lists reusable fertilizers with their optional group icon and label plus newest saved use; it supports add, edit, and delete. The suggestion section deduplicates every structured fertilizer suggestion in the current Knowledge Base Care Plans and omits suggestions already linked to the private catalog. Each remaining row shows the curated name and canonical group with one “Thêm” action. Adding creates or reuses a stable-ID-linked User Fertilizer, then moves it into “Phân bón của tôi”; it never creates a Care Activity or saved-use status.

Keep search and filtering in the top bar rather than in the scrolling page. In the default state, show the search icon first and the filter icon second. Pressing search replaces the title with an auto-focused search field; pressing back while searching clears the query and restores the title before a later back press navigates away. The filter icon remains available while searching and opens the canonical fertilizer groups in a bottom sheet. Choosing a group closes the sheet, and the filter icon shows a persistent active indicator until “Tất cả” clears it. Search and the selected group apply to both sections.

Supporting text explains that suggestions may help the grower remember inputs when purchasing or using fertilizer, but do not mean a Plant needs fertilizer now. The saved-use line uses the same “Đã bón cho “{plant}”…” wording as Care Entry and never reflects an unsaved draft or catalog-only add. Deleting a reusable fertilizer requires confirmation and leaves saved Fertilizer Applications unchanged. The same management screen is also reachable contextually from fertilizing Care Entry, which returns the selected fertilizer to the existing draft.

**Empty state:** The More index always shows its shipped destinations. Fertilizer Management shows “Chưa có phân bón đã lưu” with “Thêm phân bón”.

**Loading state:** Render the local More index immediately. Fertilizer Management renders its local catalog before remote synchronization.

**Error state:** Keep errors inside the affected row or section. A failed suggestion add remains available to retry and does not create a partial private record.

“Lưu ý sử dụng” is a read-only, scrollable explanation of the app's scope, schedule and weather limitations, product-label priority, symptom uncertainty, and user responsibility. It requires no acknowledgement and stores no state.

**User actions:** Manage saved fertilizers, review notification permission, browse read-only stage guidance, customize stage schedules, customize one plant schedule, or read the usage notice.

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

Today, Plants, Journal, and More remain persistent destinations. Single-plant care actions live on Today and Plant Detail, where one Plant's context is visible. Plant List owns the explicit multi-select care path because all affected Plants are visible before details are shared. More owns secondary management destinations such as Fertilizer Management and settings.

No global FAB avoids duplicating Today actions. Plant Detail alone may use one plant-scoped floating action menu because plant context is already fixed; it opens Care Entry or “Thêm nhật ký” and never writes history directly.

Journal is justified by cross-plant activity history, but prototype research should confirm it remains frequent enough for a tab.

Reminders stay secondary because users encounter them through daily care or one plant's context.

## 10. Visual language

Follow `docs/design/DESIGN.md` for tokens, typography, spacing, components, and mockup exceptions.

For an initial route-level load with no usable screen content yet, replace the screen body with the shared full-screen loading state. Keep incremental work contextual: button saves, weather refreshes, pagination, and picker queries continue to show loading only in their owning control or section. The loading state announces itself as busy to assistive technology and never blocks already available local content merely because an independent remote section is refreshing.

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
