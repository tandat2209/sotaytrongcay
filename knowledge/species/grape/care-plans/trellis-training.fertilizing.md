---
id: grape.recommendation.trellis-training.fertilizing
type: care_plan
title: Bón phân giai đoạn leo giàn
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trellis-training
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: >-
  Nuôi các cành cấp 1 đang tỏa ra mặt giàn. Chuyển từ phân giàu đạm thuần sang
  tỉ lệ cân bằng hơn vì cây cần kali cho sự cứng cáp của cành.
recommended_inputs:
  - group: Phân NPK cân đối
    suggestions:
      - id: fertilizer.npk-16-16-16
        name: NPK 16-16-16
        fertilizer_group: npk
      - id: fertilizer.compost
        name: Phân compost
        fertilizer_group: organic
  - group: Phân hữu cơ bón phụ
    suggestions:
      - id: fertilizer.fish-emulsion
        name: Phân cá
        fertilizer_group: organic
      - id: fertilizer.seaweed-extract
        name: Rong biển
        fertilizer_group: supplement
      - id: fertilizer.compost
        name: Phân compost
        fertilizer_group: organic
frequency:
  ground:
    display: Mỗi 2–4 tuần
    interval_days: 21
  container:
    display: Mỗi 1–2 tuần ở liều giảm
    interval_days: 20
notes:
  - >-
    Ngừng dùng phân giàu đạm thuần. Quá nhiều đạm mà thiếu kali tạo cành mềm, dễ
    bệnh và khó hóa gỗ.
  - >-
    Bắt đầu chú ý đến kali — rất quan trọng cho quá trình hóa gỗ cần thiết trước
    khi cây có thể ra trái.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
priority: 50
---
