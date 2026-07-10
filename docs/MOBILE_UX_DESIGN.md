# Mobile-first UX design

## 1. Experience goal

The app should feel like a calm, intelligent gardening journal: open quickly, understand immediately, and save an entry within seconds. Grapes are first, but the interface uses the generic Vietnamese term **Cây trồng**.

The design draws principles—not visual copies—from Apple Health's structured history, Notion's clarity, and Duolingo's obvious actions and positive feedback.

## 2. UX principles

### Fast before exhaustive

- A common entry takes no more than three taps from Home.
- Plant, activity type, and time are the only essential fields.
- Time defaults to now; plant defaults to recent context.
- Product, amount, notes, and photos are optional and editable later.

### Clear for non-technical users

- Use everyday Vietnamese verbs: “Tưới nước”, “Bón phân”, “Cắt tỉa”, “Phun”, “Quan sát”.
- Pair icons with text for important actions.
- Give every screen one obvious primary action.
- Do not require users to understand tags, filters, or garden hierarchy.

### Mobile-first

- Minimum 44 × 44 pt targets and thumb-reachable frequent actions.
- A global Add action remains in bottom navigation.
- Use bottom sheets for short forms and full screens for long input.
- Capture or select photos without leaving the entry flow.
- Offline saves remain available and show unobtrusive sync status.

### Trustworthy feedback

- Save locally first and sync in the background.
- Confirm with a brief snackbar and “Hoàn tác”.
- Do not add streak pressure or scoring to MVP.
- Use neutral language for overdue reminders.

## 3. MVP UX scope

- Create and edit plants.
- Record watering, fertilizing, pruning, spraying, and observations.
- Add up to five photos per journal entry.
- View a timeline for each plant.
- Create, complete, snooze, and delete one-time reminders.
- View today's due work.

Future scope includes gardens/areas, complex recurrence, collaboration, guidance, image diagnosis, weather, sensors, and advanced analytics.

## 4. Navigation

Bottom navigation:

1. **Hôm nay** — due work and recent activity.
2. **Cây trồng** — plants and their timelines.
3. **Thêm** — prominent quick-entry action.
4. **Nhắc việc** — upcoming and completed reminders.

The MVP has no global Journal tab. History lives inside each plant because the primary question is “What happened to this plant?” Settings open from Home.

## 5. Core flows

- First use: `Chào mừng → Tạo cây đầu tiên → Hôm nay → Ghi nhanh`.
- Quick entry: `Thêm → Chọn loại → Kiểm tra cây/thời gian → Lưu`.
- Three-tap watering: `Thêm → Tưới nước → Lưu`.
- History: `Cây trồng → Chọn cây → Dòng thời gian → Bản ghi`.
- Reminder: `Nhắc việc → Tạo lời nhắc → Chọn cây/việc/thời gian → Lưu`.
- Completion: `Hôm nay → Hoàn thành → Hoàn thành & ghi vào nhật ký`.

Do not require registration before the first plant and entry. Ask for notification, camera, or photo permission only when the related action begins.

## 6. MVP screen list

1. Welcome
2. Today
3. Plant list
4. Create/edit plant
5. Plant detail and timeline
6. Quick entry
7. Journal entry detail
8. Reminder list
9. Create/edit reminder
10. Settings

## 7. Screen specifications

### 7.1 Welcome

**Purpose:** Explain the value in seconds and lead directly to the first plant.

**Components:** Gentle plant/timeline illustration; title “Nhớ mọi điều quan trọng về cây của bạn”; three short benefits; primary “Tạo cây đầu tiên”; restore/sign-in link only when supported.

**Empty state:** This is the initial state; no separate empty treatment.

**Loading state:** Avoid a long splash. Show “Đang bắt đầu…” inside the primary button during initialization.

**Error state:** Keep the introduction and show “Chưa thể bắt đầu. Hãy thử lại.” with “Thử lại”.

**User actions:** Create the first plant; restore or sign in when available.

### 7.2 Today

**Purpose:** Answer “What needs care today?” and “What did I record recently?”

**Components:** Date/greeting; up to three due reminders; inline completion; quick actions; 3–5 recent entries; global Add; Settings entry.

**Empty state:** No plants: “Bắt đầu với cây đầu tiên của bạn” + “Thêm cây”. No entries: “Hôm nay cây của bạn thế nào?” + “Ghi quan sát”. No due work: “Hôm nay không có việc đến hạn”.

**Loading state:** Skeleton reminder and recent rows. Quick entry stays available when local data is ready.

**Error state:** Retain local data and show “Chưa thể cập nhật dữ liệu” + “Thử lại”. Keep errors within the affected section.

**User actions:** Complete/snooze reminders, record care, open recent plants/entries, open all reminders, open Settings.

### 7.3 Plant list

**Purpose:** Help users recognize and open the right plant quickly.

**Components:** “Cây trồng” title; “Thêm cây”; cards with photo, name, type, and latest activity; search only at eight or more plants.

**Empty state:** “Mỗi hành trình bắt đầu từ một cây” + “Thêm cây đầu tiên”.

**Loading state:** Three card skeletons; retain stale local cards when available.

**Error state:** “Chưa thể tải danh sách cây” + “Thử lại”; show local data with sync status when possible.

**User actions:** Open a plant, create a plant, search a long list. Essential actions never depend on undiscoverable swipe/long-press gestures.

### 7.4 Create or edit plant

**Purpose:** Create a useful plant profile with minimal required input.

**Components:** Optional photo; required plant name; plant type defaulting to “Nho”; “Cây khác”; optional variety, planted date, and notes under “Thêm thông tin”; “Lưu cây”; archive/delete options when editing.

**Empty state:** Clean form focused on the name. Do not immediately open the keyboard when context still needs reading.

**Loading state:** Disable save and show “Đang lưu…” in the button; preserve the draft locally.

**Error state:** Missing name: “Hãy đặt tên cho cây”. Save failure preserves all values. Photo failure does not block saving the plant.

**User actions:** Add photo, name/type the plant, reveal optional fields, save, cancel, archive, or delete after confirmation.

### 7.5 Plant detail and timeline

**Purpose:** Show current context and complete history for one plant.

**Components:** Plant photo/name/type; edit; last watering/fertilizing summaries; “Ghi hoạt động”; date-grouped timeline; thumbnails; simple filters only after ten entries.

**Empty state:** “Chưa có câu chuyện nào cho cây này” + “Ghi hoạt động” + “Thêm ảnh quan sát”.

**Loading state:** Show plant identity first and timeline skeletons afterward. Use a small pagination indicator at the list end.

**Error state:** Keep plant details if timeline fails. If the plant no longer exists, explain and return to the list.

**User actions:** Record activity, open/filter entries, edit plant, view photos.

### 7.6 Quick entry

**Purpose:** Record care or an observation with the fewest possible taps.

**Components:** Bottom sheet with “Tưới nước”, “Bón phân”, “Cắt tỉa”, “Phun”, and “Quan sát”; contextual plant; current time; optional photos/notes; optional activity-specific details; keyboard-pinned “Lưu”.

**Empty state:** If no plant exists, show “Hãy thêm cây trước khi ghi nhật ký” + “Thêm cây”.

**Loading state:** Activity choices open instantly. Show “Đang lưu…” in the button. Upload each photo independently.

**Error state:** Show missing plant beside the field. Preserve failed drafts. Mark individual failed photos with retry/remove actions.

**User actions:** Select entry type, plant, and time; add optional details/photos; save or close with unsaved-change confirmation.

### 7.7 Journal entry detail

**Purpose:** Review a historical event and correct it when necessary.

**Components:** Entry type, plant, date/time, entered details only, photo gallery, “Chỉnh sửa”, and delete menu.

**Empty state:** Not applicable; the screen requires an existing entry.

**Loading state:** Skeleton metadata/content and ratio-preserving image placeholders.

**Error state:** If deleted elsewhere, show “Bản ghi này không còn tồn tại” and return to timeline. Image errors never hide text.

**User actions:** Edit via a prefilled quick-entry form, view photos, delete after confirmation, open the related plant.

### 7.8 Reminder list

**Purpose:** Show upcoming work and allow fast completion.

**Components:** “Sắp tới” and “Đã hoàn thành”; task, plant, time, and completion control; “Tạo lời nhắc”; neutral overdue styling.

**Empty state:** “Chưa có lời nhắc nào” + supporting text + “Tạo lời nhắc”.

**Loading state:** Row skeletons while create remains available.

**Error state:** Keep local reminders with a sync banner. If none load, show an inline retry state.

**User actions:** Create/open, complete and optionally journal, snooze until tomorrow, review completed reminders.

### 7.9 Create or edit reminder

**Purpose:** Schedule simple care without turning the product into a complex calendar.

**Components:** Care type; required plant; required date/time; optional note; notification toggle; “Lưu lời nhắc”. Recurrence is future scope.

**Empty state:** New form defaults to today and the next sensible future time; do not guess the care type.

**Loading state:** Show progress inside Save. Explain notification permission before opening the system prompt.

**Error state:** Past time suggests “Đặt vào ngày mai”. Missing fields show inline errors. Denied notification still allows in-app saving and offers “Mở cài đặt”.

**User actions:** Select care, plant, and time; toggle notification; save, edit, or delete.

### 7.10 Settings

**Purpose:** Manage essential preferences outside primary navigation.

**Components:** Notification status/system link; language; units; future export/privacy actions; help/feedback; app version.

**Empty state:** Not applicable; core settings always exist.

**Loading state:** Show local settings immediately; skeleton only remote account/sync rows.

**Error state:** Keep errors inside the affected row; never replace the whole screen.

**User actions:** Change preferences, open system notification settings, get help, provide feedback, export/delete data when supported.

## 8. Shared interaction patterns

- Use specific save labels: “Lưu bản ghi”, “Lưu cây”, “Lưu lời nhắc”.
- After save, close the form and show “Đã lưu · Hoàn tác” for 4–6 seconds.
- Confirm deletion with the object's name; prefer archive for plants with history.
- Capture/select photos in one action sheet; one failed photo never fails the entry.
- Keep Save visible above the keyboard and follow natural focus order.

## 9. Visual language

- Warm neutral background; green reserved for actions and positive states.
- Clear type hierarchy with body text at least 16 pt.
- Moderate corner radius, subtle borders, minimal shadows.
- Simple line icons always paired with labels.
- Plant photos provide the main emotional color.
- Define semantic color tokens so dark mode can follow after MVP.

## 10. Accessibility

- Support Dynamic Type without clipping.
- Meet WCAG AA contrast and never encode state with color alone.
- Label every icon for screen readers.
- Respect Reduce Motion.
- Describe form errors in text and focus the first error.
- Localize date/time to the device locale and timezone.

## 11. Feature priority

**P0:** Plants, five entry types, photos, per-plant timeline, one-time reminders, Today.

**P1:** Search, draft recovery, snooze, archive, edit/delete entries, basic export.

**P2:** Recurrence, multi-plant actions, gardens/areas, collaboration, analytics, weather, guidance, diagnosis, sensors.

## 12. Prototype success criteria

At least four of five target users can, without help:

- create the first plant in under 60 seconds;
- record watering in under 20 seconds;
- add an observation photo in under 30 seconds;
- find the latest fertilizing entry;
- create and complete a reminder;
- explain the difference between past journal entries and future reminders.
