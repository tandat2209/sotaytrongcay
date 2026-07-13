---
id: grape.recommendation.canopy-formation.watering
type: care_plan
title: Tưới nước giai đoạn hình thành tán
goal: >-
  Tán lá lớn tăng thoát hơi nước đáng kể. Cần tưới đều và đủ, nhưng bắt đầu giảm
  dần ở cuối giai đoạn để chuẩn bị cho cây hóa gỗ và nghỉ ngắn.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.canopy-formation
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
frequency:
  ground:
    display: 'Mỗi 3–4 ngày, giảm dần ở 2–3 tuần cuối giai đoạn'
    interval_days: 3
  container:
    display: 'Mỗi 2–3 ngày, giảm tần suất khi cành bắt đầu hóa gỗ'
    interval_days: 2
notes:
  - >-
    Tán lá rộng che mặt đất — kiểm tra độ ẩm đất dưới tán, không chỉ nhìn mặt
    đất bên ngoài.
  - Giảm tưới ở cuối giai đoạn kích thích hóa gỗ tự nhiên của cành.
  - >-
    Đất không bao giờ để khô hẳn trong giai đoạn này — cây đang tích lũy năng
    lượng.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
priority: 50
---
