---
id: grape.stage.canopy-formation
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Hoàn thiện bộ tán lá quang hợp và tích lũy dinh dưỡng vào cành mẹ.
entry_criteria:
  - Cành cấp 1 đã hoàn thiện
  - Mầm nách cấp 1 nảy thành cành cấp 2
exit_criteria:
  - Cành hóa gỗ (chuyển màu nâu)
  - Tán lá phủ kín mặt giàn
estimated_duration: 2-3 tháng
default_reminder_templates:
  - Giảm hoặc hạn chế phân đạm (N) khi đã đủ lá
  - Bón phân Lân (P) và Kali (K)
  - Cắt tỉa lá già/bệnh
recommended_knowledge_topics:
  - Quá trình hóa gỗ của cành nho
  - Tỉ lệ N-P-K giai đoạn tạo tán
references:
  - ref.osu.growing-table-grapes
---
Nuôi dưỡng cành cấp 2, cấp 3 để tạo độ che phủ và chuẩn bị những cành mang quả (cành mẹ) khỏe mạnh.

## UX & Behavioral Design

- **Why it exists:** Expanding leaf surface area to generate energy. These branches will become the fruiting wood for the first harvest.
- **Why separated:** Nutrition changes significantly. We must stop Nitrogen (to stop green growth) and increase Phosphorus/Potassium to harden the branches (hóa gỗ).
- **User Actions to Advance:** Observing and logging "Cành đã hóa nâu hoàn toàn".
- **Active Reminders:** Stop N-fertilizer, apply P/K, maintain canopy airflow to prevent mildew.
- **Timeline Highlights:** "Cành hóa gỗ".
- **UI Communication:** Full canopy graphic. The color palette of the UI can subtly shift to darker greens and browns, hinting at maturity.
