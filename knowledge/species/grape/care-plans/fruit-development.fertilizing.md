---
id: grape.recommendation.fruit-development.fertilizing
type: care_plan
title: Bón phân giai đoạn nuôi quả
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.fruit-development
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 7
on_missing_history: withhold
goal: >-
  Duy trì bón nặng với trọng tâm kali ngày càng tăng. Trái đang phình to nhanh
  qua quá trình tích lũy nước và đường. Đây là giai đoạn tiêu hao dinh dưỡng
  nhiều nhất trong toàn bộ chu kỳ.
recommended_inputs:
  - catalog_id: fertilizer-role.high-potassium
    priority: primary
  - catalog_id: fertilizer-role.potassium-only
    priority: alternative
  - catalog_id: fertilizer-role.organic-foundation
    priority: alternative
frequency:
  ground:
    display: Mỗi 1–2 tuần
    interval_days: 7
  container:
    display: Hàng tuần — đây là giai đoạn nho trồng chậu dễ thiếu dinh dưỡng nhất
    interval_days: 7
notes:
  - >-
    Tưới không đều làm tăng rủi ro nứt trái. Duy trì độ ẩm ổn định và chỉ bổ
    sung dinh dưỡng khi có căn cứ phù hợp.
  - >-
    Bắt đầu giảm đạm so với kali khi trái gần chuyển màu (véraison). Dư đạm lúc
    này làm chậm chín và giảm độ ngọt.
  - >-
    Mưa lớn rửa trôi dinh dưỡng nhanh — bón sớm hơn dự kiến sau những trận mưa
    mùa.
fertilizer_group_guidance:
  - group: potassium-rich
    description: >-
      Có vai trò trong vận chuyển đường, điều tiết nước và phát triển quả nho.
      Công thức NPK thiên kali vẫn phải được đọc theo nhãn; thiếu hoặc thừa kali
      đều có thể ảnh hưởng chất lượng, nên không bổ sung chỉ dựa trên một dấu
      hiệu đơn lẻ.
version: 2.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
  - ref.umn.high-tunnel-nutrient-management
  - ref.uc-ipm.growing-grape
  - ref.uc-ipm.grape-fertilization
priority: 50
---
