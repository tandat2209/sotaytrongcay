---
id: grape.recommendation.trunk-development.watering
type: care_plan
title: Kiểm tra đất trước khi tưới
goal: >-
  Nhu cầu nước của cây thay đổi theo điều kiện trồng và tình trạng sinh trưởng
  thực tế. Kiểm tra trực tiếp trước khi tưới giúp tránh tưới thừa gây úng rễ.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trunk-development
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
notes:
  - >-
    Không tự động điền sẵn lượng nước hoặc độ ẩm đất khi người dùng chưa xác
    nhận.
  - Không suy đoán điều kiện trồng khi chưa có đủ bối cảnh.
  - Không chuyển thời gian từ lần tưới trước thành lượng nước tưới tự động.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
priority: 50
---
