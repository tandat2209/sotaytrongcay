# Mobile-first UX design

## 1. Experience goal

The app should feel like an experienced gardener accompanying a beginner: open quickly, understand today's priority, learn why it matters, and complete the work with confidence.

Grapes are the first optimized plant. The interface uses the generic Vietnamese term **Cây trồng** so the experience can support other species without redesign.

Guidance is the primary value. The journal is generated naturally as recommended tasks are completed, while manual logging remains available for unplanned work.

## 2. UX principles

### Guide before asking users to decide

- Start with “Hôm nay bạn nên làm gì?” rather than a blank entry form.
- Show a small prioritized task list from the current stage playbook.
- Explain why each recommendation matters now.
- Show what to avoid and what to prepare next.
- Let users confirm reality; never auto-advance a stage.

### Track without duplicate work

- Completing a recommended task creates its journal entry automatically.
- Notes and photos are optional after completion.
- Manual Quick Entry remains available from the FAB.
- Automatic entries show their source and remain editable.

### Fast before exhaustive

- A common entry takes no more than three taps before Save.
- Plant, activity type, and time are the only essential fields.
- Time defaults to now; plant defaults to recent context.
- Rich details stay collapsed under “Thêm chi tiết”.
- Photos, notes, products, amounts, and dosage remain optional.

### Teach progressively

- Show only guidance relevant to the current stage and task.
- Keep the immediate reason short; reveal deeper guidance on demand.
- Use observable completion criteria and plain Vietnamese.
- Avoid diagnosis language and guaranteed outcomes.

### Destinations are not actions

- Bottom navigation contains places users revisit, not commands.
- Logging uses a global Floating Action Button (FAB), not a navigation tab.
- The FAB opens the Quick Action menu in one tap.
- Reminders support daily work but do not own a primary navigation destination.

### Clear for non-technical users

- Use everyday Vietnamese labels: “Tưới nước”, “Bón phân”, “Cắt tỉa”, “Phun thuốc”, and “Quan sát”.
- Pair icons with text for important actions.
- Give every screen one obvious primary action.
- Avoid hidden gestures for essential behavior.

### Mobile-first

- Use minimum 44 × 44 pt targets and thumb-reachable frequent actions.
- Use bottom sheets for short choices and full screens for longer forms.
- Capture or select photos without leaving the entry flow.
- Save locally first and show unobtrusive sync status.
- Preserve content space with progressive filters and collapsed detail.

### Trustworthy feedback

- Confirm local save with “Đã lưu · Hoàn tác”.
- Confirm guided completion with “Đã hoàn thành và lưu vào nhật ký”.
- Do not add streak pressure or scoring to MVP.
- Use neutral language for overdue reminders.
- Label stale weather and never present a suggestion as guaranteed advice.

## 3. MVP UX scope

- Create and edit plants.
- Set a species-defined growth stage.
- View the current stage goal, guidance, risks, completion criteria, and next stage.
- Receive a short deterministic list of recommended tasks.
- See why each task matters and what to avoid.
- Complete a task and automatically create a journal entry.
- Record watering, fertilizing, pruning, spraying, and observations.
- Capture structured health conditions with optional notes and photos.
- Add optional fertilizer and spray details.
- View a dashboard and timeline for each plant.
- Browse a global journal across all plants.
- Create, complete, snooze, and delete one-time reminders.
- Suggest the next reminder after an activity is saved.
- View due work, recent completions, insights, and lightweight weather on Today.
- See progress toward the next growth-stage milestone.
- Manage preferences, data tools, and support from Me.

MVP guidance uses reviewed grape playbooks and deterministic weather rules. Future scope includes AI personalization, additional species, diagnostics, collaboration, analytics, and connected devices.

## 4. Navigation architecture

### Bottom navigation

1. **Hôm nay** — daily guidance, priorities, and progress.
2. **Cây trồng** — plant management and plant-specific history.
3. **Nhật ký** — global activity history across all plants.
4. **Tôi** — preferences, data management, support, and account capabilities.

The selected destination preserves its own navigation stack. Returning to a selected tab scrolls to the top; a second tap may reset that tab to its root screen.

### Floating Action Button

A circular `➕` FAB sits above the bottom-right edge of the tab bar. It is visually separate from the four destinations and has the accessibility label “Ghi hoạt động hoặc thêm cây”.

One tap opens the Quick Action menu:

- “Tưới nước”
- “Bón phân”
- “Cắt tỉa”
- “Phun thuốc”
- “Quan sát”
- “Thêm cây”

The menu opens as a bottom sheet with large labeled rows. The most recent activity may appear first only after user behavior supports that ordering; labels never disappear.

### FAB visibility rule

The FAB is available throughout the authenticated main shell, including destination roots, Plant Detail, Journal results, and secondary reminder screens.

It hides during onboarding, authentication, camera/photo capture, full-screen create/edit forms, destructive confirmations, and while the keyboard is active.

This is deliberate pushback on “everywhere”: showing a global action during another focused task creates competing primary actions and can obscure form controls.

### Secondary navigation

- A reminder summary on “Hôm nay” opens “Tất cả lời nhắc”.
- “Tôi” also links to the same reminder-management screen.
- A plant card opens Plant Detail, which contains Dashboard, Details, and Timeline sections.
- A global Journal item and a plant Timeline item open the same Activity Detail screen.
- “Tôi” replaces the former standalone Settings destination.

## 5. Core user flows

### First use

`Chào mừng → Tạo cây đầu tiên → Chọn giai đoạn → Hôm nay`

Registration is not required before the first plant and activity. Permissions are requested only when the related action begins.

### Complete guided work

`Hôm nay → Công việc đề xuất → Xem lý do → Hoàn thành → Nhật ký tự động`

After completion:

`Đã hoàn thành → Thêm ảnh hoặc ghi chú` (optional)

### Manual quick logging

`FAB → Chọn hoạt động → Kiểm tra cây và thời gian → Lưu → Chọn nhắc việc`

The shortest watering path remains:

`FAB → Tưới nước → Lưu`

### Add a plant

`FAB → Thêm cây → Nhập thông tin tối thiểu → Lưu cây`

The Plant List also exposes “Thêm cây” for users already managing plants.

### Browse the global journal

`Nhật ký → Tìm kiếm hoặc lọc → Chọn hoạt động → Chi tiết hoạt động`

### Review one plant and its guidance

`Cây trồng → Chọn cây → Mục tiêu hôm nay → Công việc đề xuất → Mốc tiếp theo`

History remains available through:

`Cây trồng → Chọn cây → Dòng thời gian → Chi tiết hoạt động`

### Manage reminders

`Hôm nay → Xem tất cả lời nhắc → Tạo, hoàn thành hoặc hoãn`

Alternative entry:

`Tôi → Lời nhắc → Tất cả lời nhắc`

### Complete a reminder

`Hôm nay → Hoàn thành → Hoàn thành & ghi vào nhật ký`

This prevents duplicate entry while keeping “Chỉ hoàn thành” available.

## 6. Screen inventory

### Primary destinations

1. Today — “Hôm nay”
2. Plant List — “Cây trồng”
3. Journal — “Nhật ký”
4. Me — “Tôi”

### Core and secondary screens

5. Welcome
6. Create/Edit Plant
7. Plant Detail: Dashboard, Details, Timeline
8. Quick Action menu
9. Task Guidance
10. Quick Entry
11. Activity Detail
12. Reminder Management — “Tất cả lời nhắc”
13. Create/Edit Reminder

Reminder Management remains a secondary screen. The former standalone Settings screen is removed; its responsibilities move into Me and focused secondary screens.

## 7. Screen specifications

### 7.1 Welcome

**Purpose:** Explain the value in seconds and lead directly to the first plant.

**Components:** Illustration; “Biết nên làm gì để cây phát triển tốt”; three short guidance benefits; “Bắt đầu với cây đầu tiên”; restore/sign-in only when supported.

**Empty state:** This is the initial state.

**Loading state:** Avoid a long splash. Show “Đang bắt đầu…” inside the primary button.

**Error state:** Keep the introduction and show “Chưa thể bắt đầu. Hãy thử lại.” with “Thử lại”.

**User actions:** Create the first plant; restore or sign in when available.

### 7.2 Today — “Hôm nay”

**Purpose:** Answer “Hôm nay tôi nên làm gì, tại sao, và cây đang tiến tới đâu?”

**Components:**

- Date and greeting.
- “Thời tiết hôm nay” with conditions that affect care.
- “Giai đoạn hiện tại” for the selected/recent plant.
- “Mục tiêu hôm nay” with one plain-language outcome.
- “Công việc đề xuất” as a short prioritized checklist.
- “Việc đến hạn” for user reminders.
- “Tiến tới mốc tiếp theo” with completion-criteria progress.
- “Vừa hoàn thành” with recent activities.
- Global FAB.

Each task card shows the action and a short “Vì sao” explanation. Tapping the card opens full task guidance; tapping its checkbox completes it.

MVP recommendations come from reviewed stage playbooks. Weather rules may delay, suppress, prioritize, or annotate tasks.

Examples include “Mưa lớn vào ngày mai — hoãn tưới nước”, “Mưa to — tránh phun thuốc”, and “Trời nóng — kiểm tra độ ẩm đất”.

**Empty state:** No plants shows “Bắt đầu hành trình trồng cây của bạn” + “Thêm cây”. No recommendation shows “Hôm nay chưa có việc đề xuất”.

No due reminder shows “Không có lời nhắc đến hạn”. No recent activity is hidden rather than padded with generic content.

**Loading state:** Stage and cached tasks render first. Weather adjustments, reminders, and progress load independently. The FAB remains available.

**Error state:** Keep the last reviewed playbook and local tasks. Label stale weather. If rules cannot run, show unadjusted tasks with “Chưa xét thời tiết”.

**User actions:** Open/complete/skip a recommended task, inspect the reason, review progress, complete/snooze reminders, open recent activity, switch plant, or use the FAB.

### 7.3 Plant List — “Cây trồng”

**Purpose:** Manage individual plants and reach plant-specific context.

**Components:** Title; search; “Thêm cây”; cards with photo, name, species, growth stage, next reminder, and latest activity; global FAB.

Search remains compact and can collapse when the collection is small. No advanced grouping is required for MVP.

**Empty state:** “Mỗi hành trình bắt đầu từ một cây” + “Thêm cây đầu tiên”.

**Loading state:** Plant-card skeletons; retain stale local cards when available.

**Error state:** “Chưa thể tải danh sách cây” + “Thử lại”; local data remains visible with sync status.

**User actions:** Search, open a plant, add a plant, or use the FAB.

### 7.4 Create or Edit Plant

**Purpose:** Create a useful plant profile with minimal required input.

**Components:** Optional photo; required name; species defaulting to “Nho”; required growth stage; “Lưu cây”.

Optional variety, planted date, and notes sit under “Thêm thông tin”. Editing adds archive and delete actions.

Grape stages are “Cây con”, “Nuôi thân”, “Leo giàn”, “Tạo tán”, “Ra hoa”, “Đậu quả”, “Nuôi quả”, “Chín quả”, “Thu hoạch”, and “Sau thu hoạch”.

The temporary “Cây khác” species uses “Chưa xác định” until a specific species is selected.

**Empty state:** Clean form focused on the name.

**Loading state:** Show “Đang lưu…” in the button and preserve the local draft.

**Error state:** Missing name shows “Hãy đặt tên cho cây”. Missing stage shows “Hãy chọn giai đoạn sinh trưởng”. Photo failure does not block Save.

**User actions:** Add photo, name/type the plant, reveal optional fields, save, cancel, archive, or delete after confirmation.

### 7.5 Plant Detail

**Purpose:** Guide the user through the current stage before presenting historical detail.

**Components:** Plant identity; edit; global FAB; segmented sections “Tổng quan”, “Hướng dẫn”, and “Dòng thời gian”.

“Tổng quan” contains the Plant Dashboard:

- “Giai đoạn hiện tại”
- “Mục tiêu hôm nay”
- “Công việc đề xuất”
- “Điều cần chú ý”
- “Mốc tiếp theo”
- “Thời tiết hôm nay”
- “Hoạt động gần đây”

“Hướng dẫn” contains the stage goal, description, watering, fertilizers, recommended activities, avoid list, common problems, completion criteria, and next stage.

“Dòng thời gian” contains only this plant's automatic and manual entries. It is secondary to current guidance.

**Empty state:** Missing playbook shows “Chưa có hướng dẫn cho giai đoạn này” and preserves manual logging. No task shows “Hôm nay chưa có việc đề xuất”.

No history shows “Chưa có hoạt động nào”.

**Loading state:** Plant identity and cached playbook render first. Weather adjustments, tasks, progress, and history load independently.

**Error state:** Keep the last reviewed playbook offline. Label stale weather. If recommendations fail, keep stage guidance and manual FAB available.

If the plant no longer exists, explain and return to “Cây trồng”.

**User actions:** Open/complete a task, inspect stage guidance, review milestone criteria, confirm a stage change, open history, edit the plant, or use the FAB.

### 7.6 Journal — “Nhật ký”

**Purpose:** Provide trustworthy automatic and manual history across all plants.

**Components:** Search field “Tìm trong ghi chú”; chronological activity list; source label; filters; date grouping; plant thumbnail/name; global FAB.

Entry source labels are “Từ hướng dẫn”, “Từ lời nhắc”, and “Ghi thủ công”.

The filter sheet supports:

- “Loại hoạt động”
- “Cây trồng”
- “Khoảng thời gian”
- “Xóa bộ lọc”
- “Áp dụng”

Search matches user notes only in MVP. It does not search Knowledge Base content.

**Empty state:** No activities shows “Nhật ký của bạn chưa có hoạt động” + “Ghi hoạt động”.

No filter results shows “Không tìm thấy hoạt động phù hợp” + “Xóa bộ lọc”.

**Loading state:** Show local entries immediately and skeletons only for uncached pagination.

**Error state:** Preserve cached entries and show an inline retry at the failed page or search result.

**User actions:** Search notes, filter by type/plant/date, clear filters, paginate, open Activity Detail, open the related plant, or use the FAB.

### 7.7 Quick Action menu

**Purpose:** Capture unplanned care, observations, or a new plant without making manual logging the default journey.

**Components:** Bottom sheet title “Ghi nhanh”; six labeled actions; dismiss gesture; safe-area spacing.

The actions are “Tưới nước”, “Bón phân”, “Cắt tỉa”, “Phun thuốc”, “Quan sát”, and “Thêm cây”.

**Empty state:** If there are no plants, care actions remain visible but route to “Thêm cây” with a short explanation. Do not silently disable them.

**Loading state:** The menu uses bundled labels/icons and opens immediately without network work.

**Error state:** Not applicable to opening the menu. A navigation failure closes the sheet and shows “Chưa thể mở. Hãy thử lại.”

**User actions:** Select an action or dismiss the menu.

### 7.8 Task Guidance

**Purpose:** Explain a recommended task before or after completion without overwhelming Today.

**Components:**

- Task title.
- “Vì sao nên làm”.
- “Cách thực hiện” with a short reviewed instruction.
- “Điều cần tránh”.
- “Chuẩn bị tiếp theo”.
- Weather adjustment and freshness when applicable.
- “Hoàn thành”.
- “Bỏ qua hôm nay”.

The task also links to the current “Giai đoạn sinh trưởng” and its “Mốc tiếp theo”.

**Empty state:** Not applicable; a valid recommended task is required.

**Loading state:** Render bundled playbook guidance immediately. Weather context may update independently.

**Error state:** If the task is no longer applicable, show “Công việc này đã được cập nhật” + “Xem gợi ý mới”.

If weather is unavailable, show the reviewed base guidance with “Chưa xét thời tiết”.

**User actions:** Complete, skip for today, return to Today, open the stage guide, or view the related plant.

#### Guided completion

Tapping “Hoàn thành” atomically marks the task complete and creates one journal entry. The user does not fill a journal form first.

Show “Đã hoàn thành và lưu vào nhật ký” with “Thêm ảnh hoặc ghi chú” and “Hoàn tác”. Optional detail edits the created entry instead of creating another one.

### 7.9 Quick Entry

**Purpose:** Record unplanned care or an observation with the fewest possible taps.

**Components:** Selected activity; contextual plant; current time; keyboard-pinned “Lưu”; collapsed “Thêm chi tiết”.

For “Bón phân”, optional fields are “Tên sản phẩm”, “Loại phân bón”, “Tỷ lệ NPK”, “Lượng dùng”, “Cách bón”, and “Ghi chú”.

For “Phun thuốc”, optional fields are “Tên sản phẩm”, “Mục đích”, “Liều lượng”, and “Ghi chú”.

For “Quan sát”, optional conditions are “Khỏe mạnh”, “Lá vàng”, “Cháy lá”, “Đốm lá”, “Sâu hại”, “Dấu hiệu bệnh”, “Nấm mốc”, and “Héo”.

The remaining choices are “Quả phát triển kém” and “Khác”. Notes and photos remain optional.

**Empty state:** If no plant exists, show “Hãy thêm cây trước khi ghi nhật ký” + “Thêm cây”.

**Loading state:** Show “Đang lưu…” only in Save. Upload photos independently. Do not wait for weather or Knowledge Base content.

**Error state:** Show missing plant beside the field. Preserve failed drafts. Mark each failed photo with retry/remove actions.

**User actions:** Select plant/time, add optional detail/photos, save, or close with unsaved-change confirmation.

#### Post-save reminder suggestion

After local save, show “Đã lưu hoạt động.” with “7 ngày”, “14 ngày”, “30 ngày”, and “Không nhắc”. An interval creates a reminder for the same plant and activity.

The suggestion is dismissible and never blocks the saved entry. It does not claim an interval is agronomically correct.

On reminder failure, show “Chưa thể tạo lời nhắc” with “Thử lại” and “Bỏ qua”. The activity remains saved.

### 7.10 Activity Detail

**Purpose:** Review and correct one activity reached from Journal or a plant Timeline.

**Components:** Activity type, plant, date/time, source, entered details, photo gallery, “Chỉnh sửa”, and delete menu.

Automatic entries show “Từ hướng dẫn” and link back to the recommendation reason and stage version used at completion.

**Empty state:** Not applicable; an existing activity is required.

**Loading state:** Skeleton metadata/content and ratio-preserving image placeholders.

**Error state:** If deleted elsewhere, show “Hoạt động này không còn tồn tại” and return to the source list. Image errors never hide text.

**User actions:** Edit, view photos, delete after confirmation, or open the related plant.

### 7.11 Reminder Management — “Tất cả lời nhắc”

**Purpose:** Provide complete reminder management without using a primary navigation slot.

**Components:** “Quá hạn”, “Sắp tới”, and “Đã hoàn thành”; task, plant, time, completion; “Tạo lời nhắc”; global FAB.

**Empty state:** “Chưa có lời nhắc nào” + “Tạo lời nhắc”.

**Loading state:** Row skeletons while create remains available.

**Error state:** Keep local reminders with a sync banner. If none load, show “Chưa thể tải lời nhắc” + “Thử lại”.

**User actions:** Create/open, complete and optionally journal, snooze, filter by status, or use the FAB.

### 7.12 Create or Edit Reminder

**Purpose:** Schedule simple care without turning the product into a complex calendar.

**Components:** Care type; required plant; required date/time; optional note; notification toggle; “Lưu lời nhắc”. Recurrence remains future scope.

**Empty state:** Default to today and the next sensible future time; do not guess the care type.

**Loading state:** Show progress inside Save. Explain notification permission before opening the system prompt.

**Error state:** Past time suggests “Đặt vào ngày mai”. Denied permission still allows in-app saving and offers “Mở cài đặt”.

**User actions:** Select care, plant, and time; toggle notification; save, edit, or delete.

### 7.13 Me — “Tôi”

**Purpose:** Own personal preferences, data management, support, and capabilities that are important but not part of daily logging.

**Components:** Profile/header area and grouped rows:

- “Cài đặt”
- “Thông báo”
- “Lời nhắc”
- “Sao lưu & khôi phục”
- “Xuất dữ liệu”
- “Ngôn ngữ”
- “Giao diện”
- “Giới thiệu”
- “Gửi phản hồi”

Future rows are “Gói Premium”, “Cài đặt AI”, and “Thiết bị kết nối”. Do not render future rows as disabled placeholders before the capabilities exist.

**Empty state:** Not applicable. Only shipped capabilities appear.

**Loading state:** Render local preferences immediately. Load account, backup, and sync status independently.

**Error state:** Keep errors inside the affected row. Never replace the whole screen with a generic error.

**User actions:** Manage preferences, notifications, reminders, backup/restore, export, language, theme, help, feedback, and future account capabilities.

## 8. Shared interaction patterns

### Save and undo

- Use “Lưu hoạt động”, “Lưu cây”, and “Lưu lời nhắc”.
- After save, close the form and show “Đã lưu · Hoàn tác” for 4–6 seconds.
- Guided task completion shows “Đã hoàn thành và lưu vào nhật ký”.
- “Thêm ảnh hoặc ghi chú” edits the automatic entry; it never creates a duplicate.
- Never use a success dialog that blocks the next action.

### FAB and bottom sheets

- Keep the FAB above the bottom safe area and tab bar.
- Move or hide it when system UI would overlap it.
- Trap accessibility focus inside the Quick Action sheet.
- Return focus to the FAB after dismissal.
- Do not place a second competing FAB on destination screens.

### Search and filters

- Preserve filters while Activity Detail is open and when returning to Journal.
- Show active filters as removable chips.
- Put lower-frequency filters in one bottom sheet.
- Provide “Xóa bộ lọc” whenever filters produce no results.

### Destructive actions and photos

- Confirm deletion with the object's name; prefer archive for plants with history.
- Capture/select photos in one action sheet.
- One failed photo never fails the activity.

## 9. Navigation rationale

### Destination versus action

“Hôm nay”, “Cây trồng”, “Nhật ký”, and “Tôi” are persistent places with state and information users revisit. Logging changes data and completes a task, so it belongs to an action control.

### Why the FAB replaces “Thêm”

A “Thêm” tab incorrectly suggests a destination and consumes a navigation slot. The FAB makes the primary action visually distinct, available across the main shell, and reachable in one tap.

The bottom-right position preserves a balanced four-destination tab bar. A centered docked FAB can look like a fifth tab even when it is not selectable.

### Why Journal is a destination

Plant Timeline answers “What happened to this plant?” Journal answers “What has been completed across my garden?” It makes automatic tracking visible, trustworthy, and correctable.

Because guidance is now primary, prototype research must confirm Journal remains frequent enough for a tab. If not, it should move under Plants or Me rather than remain by inertia.

### Why Reminders are secondary

Users primarily encounter reminders when deciding today's work or reviewing a plant. A dedicated tab overweights scheduling and removes space from the broader global Journal.

Full management still remains reachable from Today and Me, so removing the tab does not remove capability.

### Why users return daily

Today combines current stage, goal, weather-adjusted tasks, due reminders, recent completions, and progress. It provides immediate value before the user decides what to log.

### How the structure scales

- Future AI can improve the same recommendation cards without changing navigation or completion flows.
- Diagnostics can start from the FAB or Activity Detail without becoming a tab.
- Analytics can live under Journal, Plant Detail, or Me based on scope.
- New species supply new playbooks while reusing Today, Plant Detail, task completion, Journal, and the manual FAB.
- Premium, AI settings, and connected devices fit under Me without displacing core destinations.

Add a new tab only when a capability becomes a frequent place with its own persistent state—not because it is commercially important or technically large.

## 10. Visual language

- Use a warm neutral background; reserve green for actions and positive states.
- Keep body text at least 16 pt with a clear hierarchy.
- Use moderate corner radius, subtle borders, and minimal shadows.
- Pair simple line icons with labels.
- Let plant photos provide the main emotional color.
- Use semantic color tokens so dark mode can follow without redesign.

## 11. Accessibility

- Support Dynamic Type without clipping.
- Meet WCAG AA contrast and never encode state with color alone.
- Give the FAB and every icon a screen-reader label.
- Keep navigation order predictable after opening and closing sheets.
- Respect Reduce Motion.
- Describe form errors in text and focus the first error.
- Localize date/time to the device locale and timezone.

## 12. Feature priority

**P0:** Reviewed grape playbooks; deterministic recommended tasks; guidance-first Today and Plant Detail; automatic journal creation; simple Journal; manual FAB; reminders; weather rules.

**P1:** Journal search/filters, structured observations, rich manual details, draft recovery, reminder filters, archive, export, backup/restore, language, and theme.

**P2:** Recurrence, collaboration, analytics, diagnostics, 7-day weather, alerts, AI, premium capabilities, and connected devices.

## 13. Prototype success criteria

At least four of five target users can, without help:

- identify all four navigation destinations;
- identify today's goal and highest-priority task;
- explain why a recommended task matters;
- find what to avoid and what milestone comes next;
- complete a task and understand that history was created automatically;
- add an optional photo without creating a duplicate entry;
- use `➕` for an unplanned activity;
- find an activity globally through “Nhật ký”;
- find the same activity within one plant's “Dòng thời gian”;
- find and manage all reminders without a Reminder tab;
- locate preferences and data tools under “Tôi”;
- understand that weather adjusts reviewed guidance but does not guarantee an outcome.
