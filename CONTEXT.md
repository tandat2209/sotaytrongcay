# Plant-care companion domain language

The app language is Vietnamese. Canonical business terms stay in Vietnamese so product research, UX, content, and implementation share one vocabulary.

## Plants and growth

**Cây trồng** (Plant):
An individual plant whose care history and current growth stage the user tracks.
_Avoid_: Cây nho, hồ sơ cây, gốc nho as generic entity names

**Giai đoạn sinh trưởng** (Growth stage):
A species-defined stage in a plant's current development. It provides relevant tips, risks, and milestones.
_Avoid_: Trạng thái cây, vòng đời

**Mốc tiếp theo** (Upcoming milestone):
The next observable growth outcome for the current stage.
_Avoid_: Lời nhắc, hạn chót

**Mẹo theo giai đoạn** (Stage tip):
Concise informational guidance relevant to the current stage. It is not a task, reminder, or recorded activity.
_Avoid_: Công việc, hoạt động đã làm

**Việc cần tránh** (Thing to avoid):
A stage-specific action or condition that may harm the plant and should be explained to the grower.
_Avoid_: Lỗi, công việc

## Care and history

**Hoạt động chăm sóc** (Care activity):
A core care action the user performed and wants to track: watering, fertilizing, or spraying.
_Avoid_: Mẹo, lời nhắc

**Gợi ý chăm sóc** (Care recommendation):
A contextual suggestion that the user consider a trackable care activity. It does not become history until the user saves the activity.
_Avoid_: Hoạt động đã làm, lời nhắc

**Cập nhật cây** (Plant update):
A journal note and optional photo about growth, pruning, condition, or other work. It may confirm a stage change but is not a dedicated care activity.
_Avoid_: Hoạt động quan sát, nhiệm vụ

**Tình trạng cây** (Plant health condition):
A structured condition selected for an observation, such as yellow leaves, pests, or wilting. It is not a diagnosis.
_Avoid_: Chẩn đoán bệnh, trạng thái cây

**Dấu hiệu cảnh báo** (Warning sign):
An observable plant condition that may have several possible causes and can start a troubleshooting path.
_Avoid_: Bệnh, chẩn đoán

**Nhật ký trồng cây** (Gardening journal):
The chronological history of saved core care activities and plant updates.
_Avoid_: Danh sách mẹo, danh sách lời nhắc

**Bản ghi nhật ký** (Journal entry):
A past core care activity or plant update, with optional details, notes, and photos.
_Avoid_: Gợi ý chăm sóc, bài viết

## Planning and context

**Lời nhắc** (Reminder):
A scheduled prompt for future care. It is distinct from a recommendation and from completed history.
_Avoid_: Gợi ý chăm sóc, thông báo chung

**Quy tắc gợi ý** (Recommendation rule):
A reviewed condition-and-effect rule that adjusts a care suggestion using stage, weather, season, or recent history.
_Avoid_: Lời khuyên AI, mã tùy ý

**Thời tiết hôm nay** (Today's weather):
Current local weather context used to explain or adjust care suggestions. It is not a standalone forecast destination.
_Avoid_: Dự báo thời tiết as the feature name

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
