---
id: grape.recommendation.canopy-formation.fertilizing
type: care_plan
title: Bón phân giai đoạn hình thành tán
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.canopy-formation
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 21
on_missing_history: suggest
goal: >-
  Chuyển trọng tâm sang kali và lân. Cành cần hóa gỗ và tích lũy năng lượng dự
  trữ. Dư đạm ở giai đoạn này làm chậm hóa gỗ và khiến cây yếu khi bước vào chu
  kỳ mang trái đầu tiên.
recommended_inputs:
  - group: Phân giàu kali (high-K)
    suggestions:
      - id: fertilizer.potassium-sulfate
        name: Kali sunfat
        fertilizer_group: single
      - id: fertilizer.seaweed-extract
        name: Rong biển
        fertilizer_group: supplement
  - group: Phân NPK thiên kali
    suggestions:
      - id: fertilizer.npk-12-12-17
        name: NPK 12-12-17
        fertilizer_group: npk
      - id: fertilizer.compost
        name: Phân compost
        fertilizer_group: organic
frequency:
  ground:
    display: >-
      Mỗi 3–4 tuần, giảm dần khi cành bắt đầu chuyển nâu. Ngừng bón 2–3 tuần
      trước khi cắt cành
    interval_days: 21
  container:
    display: Mỗi 2–3 tuần ở liều vừa phải. Ngừng bón 2–3 tuần trước khi cắt cành
    interval_days: 20
notes:
  - >-
    Tiếp tục bón đạm cao ở giai đoạn này là lỗi phổ biến — cây ra nhiều lá nhưng
    cành yếu, không có khả năng mang trái tốt.
  - "Cành chuyển nâu từ gốc lên là dấu hiệu hóa gỗ tốt, không phải bệnh."
  - >-
    Ở Việt Nam (không có mùa đông tự nhiên), người trồng cần chủ động giảm nước
    và dinh dưỡng để cây nghỉ ngắn trước khi cắt cành.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
priority: 50
---
