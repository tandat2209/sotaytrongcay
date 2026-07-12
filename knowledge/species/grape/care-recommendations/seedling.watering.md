---
id: grape.recommendation.seedling.watering
type: care_recommendation_definition
title: "Tưới cây con"
goal: "Cây con chưa có bộ rễ phát triển để tích trữ nước. Ưu tiên duy trì ẩm đều và thoát nước tốt — không để đất khô hẳn cũng không để úng ngập."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.seedling
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 2
on_missing_history: suggest
frequency:
  ground: "Mỗi 2–3 ngày trong mùa khô, giảm xuống khi mưa nhiều"
  container: "Mỗi 1–2 ngày — chậu thoát nước nhanh hơn đất trồng"
notes:
  - "Tưới nhẹ và đều quanh gốc, không tưới mạnh gây bật gốc cây con."
  - "Lá héo buổi sáng sớm = thiếu nước. Lá vàng + đất ẩm liên tục = tưới thừa."
  - "Không phun nước lên lá non — dễ gây nấm và cháy lá dưới nắng."
  - "Giai đoạn này cây dễ chết do úng rễ hơn do khô hạn."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
---
