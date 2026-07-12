---
id: grape.recommendation.pruning.watering
type: care_recommendation_definition
title: "Tưới nước sau cắt cành"
goal: "Cây vừa bị cắt cành lớn và đang ở trạng thái nghỉ ngắn. Cần tưới đủ ẩm để rễ hoạt động trở lại và hỗ trợ hấp thụ dinh dưỡng sau cắt, nhưng tránh tưới quá nhiều khi cây chưa có lá."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.pruning
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 5
on_missing_history: suggest
frequency:
  ground: "Mỗi 5–7 ngày — cây không có lá nên mất nước rất ít"
  container: "Mỗi 4–5 ngày — kiểm tra đất trước mỗi lần tưới"
notes:
  - "Cây không có lá nên nhu cầu nước thấp hơn nhiều so với các giai đoạn sinh trưởng. Tưới quá nhiều gây úng rễ."
  - "Tưới một lần sau cắt cành để giúp rễ hồi phục và hỗ trợ hấp thụ phân bón."
  - "Vết cắt tươi — tránh phun nước lên thân và vết cắt, chỉ tưới vào vùng rễ."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.uc-ipm.young-grape-pruning
---
