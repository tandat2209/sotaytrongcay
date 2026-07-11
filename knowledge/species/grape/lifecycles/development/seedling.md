---
id: grape.stage.seedling
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Giúp cây bén rễ, sống khỏe và bắt đầu đâm chồi mới.
entry_criteria:
  - Cây giống được trồng xuống đất hoặc chậu lớn
exit_criteria:
  - Mầm chính vươn dài trên 30-50cm
  - Bắt đầu bám giàn/cọc
estimated_duration: 2-4 tuần
default_reminder_templates:
  - Tưới nước giữ ẩm
  - Che nắng gắt
  - Kiểm tra sâu bệnh ăn lá
recommended_knowledge_topics:
  - Cách chọn đất trồng
  - Nhận biết sâu hại mầm non
references:
  - ref.osu.growing-table-grapes
---
Giai đoạn cây mới được trồng, tập trung vào việc thích nghi môi trường đất mới và phát triển bộ rễ ban đầu.

## UX & Behavioral Design

- **Why it exists:** A newly planted vine has high mortality. The focus is entirely on root establishment, not aggressive growth.
- **Why separated:** We cannot force vertical growth until the roots are secure.
- **User Actions to Advance:** Logging a timeline entry like "Mầm đã vươn dài > 30cm" triggers the prompt to move to *Nuôi thân chính*.
- **Active Reminders:** High-frequency, low-volume watering; watching for snails or leaf-eating insects.
- **Timeline Highlights:** "Ngày xuống giống" (Planted Date).
- **UI Communication:** A small sprout icon. Progress is communicated by days elapsed. The Playbook is a simple survival checklist.
