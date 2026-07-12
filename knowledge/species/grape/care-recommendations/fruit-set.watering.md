---
id: grape.recommendation.fruit-set.watering
type: care_recommendation_definition
title: "Tưới nước giai đoạn đậu quả"
goal: "Sau khi hoa rụng và trái nhỏ hình thành, cây cần nước đều đặn và ổn định. Thiếu nước đột ngột ngay sau đậu quả là nguyên nhân phổ biến gây rụng trái non."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.fruit-set
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
frequency:
  ground: "Mỗi 3–4 ngày — duy trì ẩm đều, không để khô đột ngột"
  container: "Mỗi 2–3 ngày — theo dõi sát vì trái non rất nhạy cảm với stress nước"
notes:
  - "Tưới không đều (lúc nhiều lúc ít) ngay sau đậu quả là nguyên nhân hàng đầu gây rụng trái non và nứt trái về sau."
  - "Tưới đủ và đều để trái phân chia tế bào đồng đều — ảnh hưởng trực tiếp đến kích thước trái cuối cùng."
  - "Trở lại tưới bình thường sau giai đoạn ra hoa — không còn hạn chế overhead watering nữa."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
---
