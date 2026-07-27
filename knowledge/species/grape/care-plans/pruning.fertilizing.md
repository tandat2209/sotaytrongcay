---
id: grape.recommendation.pruning.fertilizing
type: care_plan
title: Bón phân sau cắt cành
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.pruning
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: >-
  Cung cấp dinh dưỡng nhẹ nhàng để đánh thức cây sau giai đoạn nghỉ và cắt cành.
  Mắt ngủ bắt đầu sưng to nhưng bộ rễ chưa hoạt động hoàn toàn.
recommended_inputs:
  - catalog_id: fertilizer-role.balanced-nutrition
    priority: primary
  - catalog_id: fertilizer-role.organic-foundation
    priority: alternative
notes:
  - Chỉ bón một lần trong tuần đầu sau cắt cành.
  - >-
    Cây chưa có lá, không thể quang hợp — bón quá nhiều phân sẽ nằm thừa trong
    đất, gây nguy cơ mặn đất hoặc rửa trôi.
  - >-
    Nếu đã bón phân hữu cơ nặng trong giai đoạn phục hồi, bỏ qua phân hóa học ở
    đây.
  - Tưới nước trở lại từ từ — rễ cần ẩm để hấp thụ dinh dưỡng đã bón.
version: 2.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.umn.high-tunnel-nutrient-management
priority: 50
---
