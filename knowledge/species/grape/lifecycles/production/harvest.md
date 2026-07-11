---
id: grape.stage.harvest
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Sẵn sàng thu hoạch an toàn, bảo quản đúng cách.
entry_criteria:
  - Kiểm tra độ ngọt đạt yêu cầu
  - Hạt bên trong đã đen lõi
exit_criteria:
  - Cắt hết trái trên cây
estimated_duration: 1-2 tuần
default_reminder_templates:
  - Cắt nho vào sáng sớm
  - Bảo quản tủ lạnh
  - Lưu trữ hình ảnh/cân nặng
recommended_knowledge_topics:
  - Cách bảo quản nho tươi lâu
  - Bí quyết pha nước ép nho
references:
  - ref.osu.growing-table-grapes
---
Khoảnh khắc tận hưởng thành quả. Cắt những chùm nho ngon ngọt nhất.

## UX & Behavioral Design

- **Why it exists:** The ultimate payoff of the app's guidance.
- **Why separated:** It's an event, not a growing phase. 
- **User Actions to Advance:** "Đã thu hoạch xong". User inputs yield data (e.g., 5kg).
- **Active Reminders:** Cut during cool mornings, log the harvest weight for personal stats.
- **Timeline Highlights:** "Thu hoạch vụ 1 (Sản lượng: X kg)".
- **UI Communication:** Confetti! Highly rewarding UI. Focus shifts to capturing memories and recording statistics.
