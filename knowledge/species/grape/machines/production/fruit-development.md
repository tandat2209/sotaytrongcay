---
id: grape.stage.fruit-development
type: growth_stage_playbook
title: Nuôi quả
locale: vi-VN
species_id: plant.grape
sequence: 5
version: 1.0.0
status: review
machine_id: production
primary_objective: Tối đa hóa kích thước trái và giữ chùm nho sạch bệnh.
entry_criteria:
  - Đã tỉa trái xong
  - Trái bắt đầu lớn nhanh
exit_criteria:
  - Trái ngừng lớn
  - Trái bắt đầu chuyển màu (Veraison)
estimated_duration: 4-6 tuần
recommended_playbook: playbook.grape.fruit-development
default_reminder_templates:
  - Bọc chùm nho
  - Bón thúc định kỳ (NPK)
  - Kiểm tra sâu đục quả
recommended_knowledge_topics:
  - Vì sao nho bị nứt trái?
  - Sử dụng túi bọc loại nào?
references:
  - ref.osu.growing-table-grapes
---
Trái nho phình to nhanh chóng. Cây cần một lượng nước và dinh dưỡng khổng lồ.

## UX & Behavioral Design

- **Why it exists:** The longest phase. Pure biomass accumulation.
- **Why separated:** The objective is solely sizing up the fruit.
- **User Actions to Advance:** "Quả bắt đầu chuyển màu (Veraison)".
- **Active Reminders:** Heavy fertilizing, bagging the clusters to protect from fruit flies.
- **Timeline Highlights:** "Đã bọc quả".
- **UI Communication:** Berries visibly growing larger in the UI. A progress bar counting down estimated weeks until ripening.
