---
id: grape.stage.fruit-set
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Tuyển chọn và định hình chùm nho, bổ sung dinh dưỡng ngay lập tức.
entry_criteria:
  - Hoa rụng hết cánh
  - Trái non hình thành kích thước 2-3mm
exit_criteria:
  - Trái đạt kích thước bằng đầu ngón tay
  - Đã tỉa xong chùm
estimated_duration: 2-3 tuần
recommended_playbook: playbook.grape.fruit-set
default_reminder_templates:
  - Tỉa trái non (giảm mật độ)
  - Bón Canxi-Bo chống rụng trái
  - Tưới nước mạnh trở lại
recommended_knowledge_topics:
  - Kỹ thuật tỉa trái nho chuẩn
  - Phòng nấm phấn trắng trên trái non
references:
  - ref.osu.growing-table-grapes
---
Hoa đã thụ phấn thành công và hình thành những trái nho xanh nhỏ nhắn (cỡ hạt đậu).

## UX & Behavioral Design

- **Why it exists:** The transition back to active care.
- **Why separated:** We can finally resume watering and feeding. Specific interventions (thinning berries) are required here.
- **User Actions to Advance:** Completing the "Tỉa quả non" (thinning) task.
- **Active Reminders:** Calcium/Boron application, physical labor of cutting out tiny berries so the cluster has room to grow.
- **Timeline Highlights:** "Tỉa trái đợt 1".
- **UI Communication:** Small green berry cluster icon.
