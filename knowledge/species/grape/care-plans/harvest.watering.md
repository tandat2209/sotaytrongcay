---
id: grape.recommendation.harvest.watering
type: care_plan
title: Kiểm tra nước giai đoạn thu hoạch
goal: >-
  Trong khi thu hoạch, cây vẫn cần ẩm nhất định để trái không héo trước khi hái.
  Không tưới nhiều trong ngày thu hoạch — trái ướt dễ bị dập và nhanh thối hơn.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.harvest
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 5
on_missing_history: withhold
notes:
  - >-
    Trồng đất: không tưới trong ngày thu hoạch. Sau khi thu hoạch xong, tưới
    bình thường để phục hồi cây.
  - "Trồng chậu: tránh tưới trong 1–2 ngày quanh thời điểm thu hoạch."
  - Thu hoạch vào buổi sáng sớm khi trời mát — trái giữ chất lượng tốt hơn.
  - >-
    Không tưới ngay trước thu hoạch — trái ướt dập nhanh hơn và làm giảm thời
    gian bảo quản.
  - >-
    Sau khi thu hoạch xong toàn bộ, tưới lại bình thường ngay để hỗ trợ giai
    đoạn phục hồi.
version: 1.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.fao.grape-production
priority: 50
---
