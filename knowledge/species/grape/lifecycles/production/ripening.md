---
id: grape.stage.ripening
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Tăng độ ngọt, lên màu đẹp và chống chim chóc.
entry_criteria:
  - Trái bắt đầu đổi màu (Veraison)
exit_criteria:
  - Cuống trái hơi héo
  - Đạt độ ngọt mong muốn
  - Hạt chuyển màu đen
estimated_duration: 2-4 tuần
default_reminder_templates:
  - Cắt giảm nước hoàn toàn
  - Ưu tiên Kali (K), hạn chế Đạm (N) để trái chuyển màu tốt
  - Phòng chim, chuột ăn quả
recommended_knowledge_topics:
  - Bí quyết tăng độ ngọt cho nho
  - Cách xác định nho đã chín hoàn toàn
references:
  - ref.osu.growing-table-grapes
---
Trái chuyển màu (đỏ, tím, đen) và tích lũy lượng đường. Độ axit giảm xuống.

## UX & Behavioral Design

- **Why it exists:** Chemistry changes from acid/volume to sugar/color accumulation.
- **Why separated:** Care routine inverts again. Water and Nitrogen must be drastically reduced, otherwise berries will split and remain sour.
- **User Actions to Advance:** "Nho đã chín, chuẩn bị thu hoạch!".
- **Active Reminders:** Potassium (Kali) boosts for sweetness. Stop watering. Defend against birds.
- **Timeline Highlights:** "Bắt đầu lên màu (Veraison)".
- **UI Communication:** Color transitions in the UI matching the variety (green changing to purple/red).
