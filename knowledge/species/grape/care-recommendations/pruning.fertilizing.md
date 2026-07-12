---
id: grape.recommendation.pruning.fertilizing
type: care_recommendation_definition
title: "Bón phân sau cắt cành"
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
goal: "Cung cấp dinh dưỡng nhẹ nhàng để đánh thức cây sau giai đoạn nghỉ và cắt cành. Mắt ngủ bắt đầu sưng to nhưng bộ rễ chưa hoạt động hoàn toàn."
recommended_inputs:
  - group: "Phân NPK cân đối"
    examples: "NPK 16-16-16 liều vừa"
  - group: "Phân lót hữu cơ"
    examples: "Phân bò ủ hoai (\"phân lót\"), phân trùn quế rải quanh vùng rễ"
frequency:
  ground: "Một lần duy nhất trong tuần đầu sau cắt cành"
  container: "Một lần duy nhất trong tuần đầu sau cắt cành"
notes:
  - "Cây chưa có lá, không thể quang hợp — bón quá nhiều phân sẽ nằm thừa trong đất, gây nguy cơ mặn đất hoặc rửa trôi."
  - "Nếu đã bón phân hữu cơ nặng trong giai đoạn phục hồi, bỏ qua phân hóa học ở đây."
  - "Tưới nước trở lại từ từ — rễ cần ẩm để hấp thụ dinh dưỡng đã bón."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
---
