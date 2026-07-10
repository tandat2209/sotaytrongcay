# Gardening journal domain language

The app language is Vietnamese. Canonical business terms stay in Vietnamese so product copy, research, design, and implementation use the same vocabulary. Definitions are in English unless Vietnamese is required.

## Plants and growing space

**Cây trồng** (Plant):
An individual plant the user chooses to track. Grapes are one plant type, not a separate core entity.
_Avoid_: Cây nho, hồ sơ cây, gốc nho as generic entity names

**Vườn** (Garden):
A user-managed growing space that may contain plants or growing areas. It is outside the initial MVP.
_Avoid_: Trang trại, địa điểm

**Khu vực trồng** (Growing area):
An identifiable part of a garden used to group plants with a shared location or care context. It is outside the initial MVP.
_Avoid_: Lô, luống, khu

## Journal

**Nhật ký trồng cây** (Gardening journal):
The chronological record of care and observations for tracked plants.
_Avoid_: Lịch sử, sổ theo dõi

**Bản ghi nhật ký** (Journal entry):
A past event for one plant. It contains care, an observation, or both, and may include notes and photos.
_Avoid_: Bài viết, sự kiện, log

**Hoạt động chăm sóc** (Care activity):
An action performed by the grower, such as watering, fertilizing, pruning, or spraying.
_Avoid_: Công việc đã làm, thao tác

**Quan sát** (Observation):
Information recorded about a plant's condition without requiring a care action.
_Avoid_: Chẩn đoán, kiểm tra

## Planning

**Công việc chăm sóc** (Care task):
Work planned for a future time for one plant.
_Avoid_: Nhiệm vụ, sự kiện lịch

**Lời nhắc** (Reminder):
A scheduled prompt for a future care task.
_Avoid_: Cảnh báo, thông báo

## Growth cycle

**Vụ trồng** (Growing season):
A user-defined period for grouping related care, observations, and harvest outcomes. It is outside the initial MVP.
_Avoid_: Mùa, niên vụ

**Giai đoạn sinh trưởng** (Growth stage):
A meaningful development stage such as budding, flowering, fruit set, or ripening. It is outside the initial MVP.
_Avoid_: Trạng thái cây, vòng đời
