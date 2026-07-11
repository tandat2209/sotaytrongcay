# Intelligent gardening coach domain language

The app language is Vietnamese. Canonical business terms stay in Vietnamese so product research, UX, content, and implementation share one vocabulary.

## Plants and growth

**Cây trồng** (Plant):
An individual plant the user chooses to grow with guidance. Grapes are one species, not a separate core entity.
_Avoid_: Cây nho, hồ sơ cây, gốc nho as generic entity names

**Giai đoạn sinh trưởng** (Growth stage):
A species-defined stage in a plant's current development. It determines the relevant goal, guidance, risks, and completion criteria.
_Avoid_: Trạng thái cây, vòng đời

**Mục tiêu giai đoạn** (Stage goal):
The outcome the grower is trying to achieve during the current growth stage.
_Avoid_: Công việc, cột mốc

**Tiêu chí hoàn thành** (Completion criteria):
Observable conditions used by the grower to decide that a growth stage is complete.
_Avoid_: Điểm số, tiến độ tự động

**Mốc tiếp theo** (Upcoming milestone):
The next meaningful growth outcome, usually the completion criteria for moving to the next stage.
_Avoid_: Lời nhắc, hạn chót

## Guidance and planning

**Hướng dẫn theo giai đoạn** (Stage playbook):
Curated guidance for one species and stage, including goals, recommended care, risks, common problems, completion criteria, and the next stage.
_Avoid_: Bài viết, mẹo chung

**Công việc đề xuất** (Recommended task):
A concrete care action proposed from the current stage playbook and applicable context. It always includes a reason.
_Avoid_: Lời nhắc, hoạt động đã làm

**Việc cần tránh** (Thing to avoid):
A stage-specific action or condition that may harm progress and should be explained to the grower.
_Avoid_: Cảnh báo chung, lỗi

**Quy tắc hướng dẫn** (Guidance rule):
A reviewed condition-and-effect rule that adjusts a recommended task using stage, weather, season, or recent history.
_Avoid_: Lời khuyên AI, mã tùy ý

**Lời nhắc** (Reminder):
A scheduled prompt for future care. It may be created by the user or offered after an activity, but it is not a recommendation by itself.
_Avoid_: Công việc đề xuất, thông báo

## Activity and history

**Hoạt động chăm sóc** (Care activity):
An action performed by the grower, such as watering, fertilizing, pruning, or spraying.
_Avoid_: Công việc đề xuất, thao tác

**Nhật ký trồng cây** (Gardening journal):
The chronological history generated from completed recommended tasks, completed reminders, manual activities, and observations.
_Avoid_: Danh sách việc cần làm, hướng dẫn

**Bản ghi nhật ký** (Journal entry):
A past event for one plant. It records what happened, when, and its source, with optional details, notes, and photos.
_Avoid_: Công việc đề xuất, bài viết

**Quan sát** (Observation):
Information recorded about a plant's condition without requiring a care action.
_Avoid_: Chẩn đoán, kiểm tra

**Tình trạng cây** (Plant health condition):
A structured condition selected for an observation, such as yellow leaves, pests, or wilting. It is not a diagnosis.
_Avoid_: Chẩn đoán bệnh, trạng thái cây

**Dấu hiệu cảnh báo** (Warning sign):
An observable plant condition that may have several possible causes and can start a troubleshooting path.
_Avoid_: Bệnh, chẩn đoán

## Context and knowledge

**Thời tiết hôm nay** (Today's weather):
Current local weather context used to adjust or explain care recommendations. It is not a standalone forecast destination.
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
