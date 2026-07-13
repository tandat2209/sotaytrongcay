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
    Kiểm tra đất quanh vùng rễ trước khi tưới; chỉ tưới khi đất bắt đầu khô,
    không tưới theo lịch cố định.
  - >-
    Tưới chậm vào vùng gốc để đất ẩm đều; không để nước đọng quanh gốc hoặc
    trong chậu.
  - >-
    Điều chỉnh lần tưới theo nắng, mưa, loại chậu và khả năng thoát nước của
    đất.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
priority: 50
---
