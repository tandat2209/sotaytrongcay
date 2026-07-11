---
id: grape.stage.bud-break
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Theo dõi sự phát triển của mầm và bảo vệ khỏi côn trùng, nấm bệnh.
entry_criteria:
  - Mắt ngủ sưng to và nứt xanh
exit_criteria:
  - Chồi vươn dài
  - Nụ hoa (bông gió) xuất hiện rõ rệt
estimated_duration: 2-3 tuần
default_reminder_templates:
  - Phun ngừa bọ trĩ ăn mầm
  - Tưới nước trở lại (lượng nhỏ)
  - Cung cấp dinh dưỡng kích chồi (nếu cần)
recommended_knowledge_topics:
  - Nhận biết bọ trĩ
  - Phân biệt chồi hoa và chồi điếc
references:
  - ref.osu.growing-table-grapes
---
Mầm bắt đầu nứt ra khỏi vỏ và phát triển thành chồi non mang theo nụ hoa nhỏ.

## UX & Behavioral Design

- **Why it exists:** The most vulnerable physical state. Tiny bugs can destroy an entire harvest overnight.
- **Why separated:** Requires vigilant pest scouting (bọ trĩ/thrips) unlike the pruning stage.
- **User Actions to Advance:** "Phát hiện nụ hoa".
- **Active Reminders:** Daily pest scouting, applying first round of fertilizer.
- **Timeline Highlights:** "Nứt mầm đầu tiên".
- **UI Communication:** Bud swelling/bursting animation. Urgency is conveyed in the Playbook for pest control.
