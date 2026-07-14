---
id: grape.recommendation.flowering.watering
type: care_plan
title: Tưới nước giai đoạn ra hoa
goal: >-
  Giai đoạn ra hoa rất nhạy cảm với nước. Cần duy trì độ ẩm đất ổn định nhưng
  tuyệt đối không để nước chạm vào hoa — tưới overhead làm rửa trôi phấn hoa và
  gây thối bông.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.flowering
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
frequency:
  ground:
    display: "Mỗi 3–4 ngày, chỉ tưới vào vùng rễ (tưới gốc hoặc nhỏ giọt)"
    interval_days: 3
  container:
    display: "Mỗi 2–3 ngày, đổ nước vào đĩa lót hoặc tưới gốc nhẹ nhàng"
    interval_days: 2
notes:
  - >-
    Tuyệt đối không tưới phun từ trên xuống khi cây đang nở hoa — rửa trôi phấn
    hoa là nguyên nhân hàng đầu gây thất thu.
  - >-
    Hạn chế tưới quá nhiều — stress khô nhẹ trong giai đoạn ra hoa giúp thụ phấn
    tốt hơn.
  - >-
    Mưa lớn khi ra hoa gây hại lớn và không kiểm soát được — không bù đắp bằng
    tưới thêm.
  - >-
    Sau khi hoa rụng và trái bắt đầu hình thành, có thể trở lại tưới bình
    thường.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.fao.grape-production
priority: 50
---
