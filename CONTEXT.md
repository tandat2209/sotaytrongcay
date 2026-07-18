# Plant-care companion domain language

The app language is Vietnamese. Canonical business terms stay in Vietnamese so product research, UX, content, and implementation share one vocabulary.

## Plants and growth

**Cây trồng** (Plant):
An individual plant whose care history and current growth stage the user tracks.
_Avoid_: Cây nho, hồ sơ cây, gốc nho as generic entity names

**Giai đoạn sinh trưởng** (Growth stage):
A species-defined stage in a plant's current development. It provides relevant tips, risks, and milestones.
_Avoid_: Trạng thái cây, vòng đời

**Thời gian ở giai đoạn hiện tại** (Current-stage age):
The elapsed local calendar days since the current stage's persisted start time. It remains unknown when the user has not confirmed when the stage began.
_Avoid_: Inferring from planting date, plant creation date, lifecycle position, or authored stage duration

**Thời gian từ khi trồng** (Planted age):
The elapsed local calendar days since the optional user-provided planting date.
_Avoid_: Treating it as days in the current stage

**Mốc tiếp theo** (Upcoming milestone):
The next observable growth outcome for the current stage.
_Avoid_: Lời nhắc, hạn chót

**Mẹo theo giai đoạn** (Stage tip):
Concise informational guidance relevant to the current stage. It is not a task, reminder, recorded activity, transition trigger, or care instruction.
_Avoid_: Công việc, hoạt động đã làm

**Nội dung giai đoạn chờ duyệt** (Review-stage content):
Reviewed-for-structure stage context that may state an objective, observable entry or exit context, duration, and sources. It does not prescribe care or create product behavior until separately approved.
_Avoid_: Quy tắc tự động, hướng dẫn can thiệp, tác vụ hệ thống

**Ảnh minh hoạ giai đoạn** (Stage illustration):
A curated visual reference for one growth stage in the Stage Playbook. It is not a photo of the user's plant, proof that the plant is at that stage, or a progress measurement.
_Avoid_: Ảnh cây của tôi, xác nhận giai đoạn, tiến độ cây

**Việc cần tránh** (Thing to avoid):
A stage-specific action or condition that may harm the plant and should be explained to the grower.
_Avoid_: Lỗi, công việc

## Care and history

**Hoạt động chăm sóc** (Care activity):
A core care action the user performed and wants to track: watering, fertilizing, or spraying.
_Avoid_: Mẹo, lời nhắc

**Vấn đề muốn xử lý** (Spraying target):
One optional curated pest or disease the grower selects while recording a spraying Care Activity. The saved stable ID and Vietnamese name snapshot record the grower's intent at that time; they are not a diagnosis, proof of presence, treatment outcome, recommendation input, or reminder trigger.
_Avoid_: Chẩn đoán, bệnh đã xác nhận, kết quả xử lý

**Lần dùng phân bón** (Fertilizer application):
One optional user-selected fertilizer item used during a saved fertilizing Care Activity. One activity may contain several applications. The MVP records the fertilizer identity and group only; nullable method, amount/unit, and item-note fields remain solely for backward-compatible history. It is user history, not a curated Fertilizer Profile or a recommendation.
_Avoid_: Kế hoạch chăm sóc, hồ sơ phân bón đã duyệt, gợi ý bón phân

**Phân bón của tôi** (User fertilizer):
A reusable, private fertilizer record managed by the grower and selectable while recording fertilizing. It stores identity and descriptive fields for reuse and may retain the stable ID of a reviewed suggestion, but creates no care history by itself. Editing or deleting it never rewrites saved Fertilizer Applications.
_Avoid_: Hồ sơ phân bón đã duyệt, gợi ý bón phân, lần bón phân

**Gợi ý chăm sóc** (Care recommendation):
A contextual suggestion derived from one Care Plan. It does not become history until the user saves the activity.
_Avoid_: Hoạt động đã làm, lời nhắc

**Hướng dẫn chăm sóc** (Care guide):
Generic curated knowledge for informational techniques such as training or pruning. It does not create a tracked activity or recommendation.
_Avoid_: Kế hoạch chăm sóc, quy tắc gợi ý, hoạt động đã làm

**Kế hoạch chăm sóc** (Care plan):
Stage-scoped guidance for one tracked watering, fertilizing, or spraying activity. It owns the goal, optional growing-method frequency, recommended inputs, important notes, and deterministic eligibility fields.
_Avoid_: Hướng dẫn chung, hoạt động đã làm, lời nhắc

**Cập nhật cây** (Plant update):
A journal note and optional photo about growth, pruning, condition, or other work. It may confirm a stage change but is not a dedicated care activity.
_Avoid_: Hoạt động quan sát, nhiệm vụ

The latest displayed plant photo is derived from the first photo of the newest photo-bearing saved Plant Update by occurrence time. An optional photo selected during plant setup is saved as a photo-only initial Plant Update at the confirmed stage. It is not a separate Plant-owned photo pointer.

**Tình trạng cây** (Plant health condition):
A structured condition selected for an observation, such as yellow leaves, pests, or wilting. It is not a diagnosis.
_Avoid_: Chẩn đoán bệnh, trạng thái cây

**Dấu hiệu cảnh báo** (Warning sign):
An observable plant condition that may have several possible causes and can start a troubleshooting path.
_Avoid_: Bệnh, chẩn đoán

**Sâu hại** (Pest):
A curated Knowledge Base entity describing a harmful organism, observable evidence, relevant monitoring stages, prevention context, safe first response, and escalation guidance. Its presence in the catalog or selection while logging is not a diagnosis or instruction to spray.
_Avoid_: Dấu hiệu cảnh báo, thuốc phun, chẩn đoán

**Bệnh hại** (Disease):
A curated Knowledge Base entity describing a plant disease, observable evidence, relevant monitoring stages, risk context, prevention, safe first response, and escalation guidance without asserting that a plant has the disease.
_Avoid_: Dấu hiệu cảnh báo, tình trạng cây, chẩn đoán

**Sâu bệnh cần theo dõi** (Stage threat guidance):
A read-only, stage-matched list of curated pests and diseases in the preview Stage Playbook. It supports observation and escalation only; it does not diagnose a plant, prescribe spraying, create a recommendation, or record history.
_Avoid_: Việc cần làm, chẩn đoán, lịch phun

**Nhật ký trồng cây** (Gardening journal):
The chronological history of saved core care activities and plant updates.
_Avoid_: Danh sách mẹo, danh sách lời nhắc

**Bản ghi nhật ký** (Journal entry):
A past core care activity or plant update, with optional details, notes, and photos.
_Avoid_: Gợi ý chăm sóc, bài viết

## Planning and context

**Lịch chăm sóc** (Care Plan Schedule):
A user-owned schedule derived from one curated Care Plan and saved care history. It is distinct from a recommendation and from completed history. Stage and plant snapshots may customize timing and OS delivery without editing curated Care Plan knowledge.
_Avoid_: Gợi ý chăm sóc, lịch sử đã hoàn thành

**Tùy chỉnh theo giai đoạn** (Stage schedule snapshot):
A user-owned schedule overlay for one exact Care Plan in one stage. Ground and container timing may be customized independently, while notification delivery and time remain shared.
_Avoid_: Chỉnh sửa Care Plan, thiết lập theo cây

**Tùy chỉnh theo cây** (Plant schedule snapshot):
A complete copied effective schedule for one plant and exact Care Plan. It overrides stage/default behavior until reset.
_Avoid_: Gợi ý chăm sóc, lịch sử chăm sóc.

**Quy tắc gợi ý** (Recommendation rule):
A reviewed part of a Care Plan that decides when its tracked care guidance is shown, using species, stage, activity history, missing-history policy, and priority. MVP supports elapsed-days history only.
_Avoid_: Lời khuyên AI, mã tùy ý

**Thời tiết hôm nay** (Today's weather):
Current local weather context shown for awareness. In the current scope it does not change care suggestions, schedules, reminders, or history, and it is not a standalone forecast destination.
_Avoid_: Dự báo thời tiết as the feature name

**Vị trí thời tiết** (Weather location):
The app-level, user-approved coarse location used to retrieve weather. It is separate from a Plant's free-text micro-location such as a balcony and from future Garden or Growing Area concepts.
_Avoid_: Vườn, Khu vực trồng, or the Plant location field

**Kiến thức chăm cây** (Plant-care knowledge):
Curated species, stage, care, problem, fertilizer, seasonal, and weather-rule content. It never contains user plants or history.
_Avoid_: Dữ liệu người dùng, lời khuyên cá nhân tự động

## Future growing-space concepts

**Vườn** (Garden):
A user-managed growing space that may contain plants or growing areas. It is outside MVP.
_Avoid_: Trang trại, địa điểm

**Khu vực trồng** (Growing area):
An identifiable part of a garden used to group plants with shared context. It is outside MVP.
_Avoid_: Lô, luống, khu
