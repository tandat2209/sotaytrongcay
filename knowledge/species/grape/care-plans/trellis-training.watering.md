---
id: grape.recommendation.trellis-training.watering
type: care_plan
title: Tưới nước giai đoạn leo giàn
goal: >-
  Cây đang sinh trưởng mạnh với nhiều lá và chồi mới. Nhu cầu nước tăng đáng kể
  so với giai đoạn cây con, nhưng vẫn cần kiểm tra đất trước khi tưới để tránh
  úng.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trellis-training
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
frequency:
  ground:
    display: "Mỗi 3–4 ngày, tăng lên nếu thời tiết nóng và khô"
    interval_days: 3
  container:
    display: Mỗi 2–3 ngày — kiểm tra độ ẩm đất trước mỗi lần tưới
    interval_days: 2
notes:
  - >-
    Tưới sâu và đều để khuyến khích rễ ăn sâu — rễ sâu giúp cây chịu hạn tốt hơn
    về sau.
  - >-
    Không tưới nhỏ giọt liên tục trên mặt đất — rễ sẽ chỉ phát triển gần mặt và
    dễ tổn thương.
  - "Tưới vào buổi sáng sớm hoặc chiều mát, tránh tưới giữa trưa nắng gắt."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
priority: 50
---
