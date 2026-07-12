---
id: grape.recommendation.check-soil-before-watering
type: care_recommendation_definition
title: "Kiểm tra đất trước khi tưới"
reason: "Kiểm tra trực tiếp giúp tránh tưới thừa gây úng rễ."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trunk-development
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  due_after_days: 3
on_missing_history: suggest
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
---

## Hướng dẫn

Kiểm tra độ ẩm của lớp đất mặt và khả năng thoát nước trước khi quyết định tưới nước. Gợi ý xuất hiện khi cây ở giai đoạn phát triển thân và lịch sử tưới cho thấy đã đến thời điểm xem lại nhu cầu nước.

## Vì sao nên làm

Nhu cầu nước của cây thay đổi theo điều kiện trồng, khả năng thoát nước và tình trạng sinh trưởng thực tế của cây. Kiểm tra trực tiếp giúp tránh tưới thừa gây úng rễ.

## Điều cần tránh

- Không tự động điền sẵn lượng nước, phương pháp hoặc độ ẩm đất khi người dùng chưa xác nhận.
- Không suy đoán điều kiện trồng hoặc lượng nước phù hợp khi chưa có đủ bối cảnh.
- Không chuyển thời gian từ lần tưới trước thành lượng nước tưới tự động.
