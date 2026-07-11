---
id: grape.recommendation.check-soil-before-watering
type: care_recommendation_definition
title: "Kiểm tra đất trước khi tưới"
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trunk-development
activity_type: watering
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
---

# Kiểm tra đất trước khi tưới

## Khi nào có thể hiển thị

Gợi ý có thể xuất hiện khi người dùng đang xem cây ở giai đoạn “Nuôi thân” và ứng dụng không có bằng chứng đáng tin cậy rằng cây vừa được tưới hoặc sắp nhận đủ mưa.

Thiếu lịch sử không có nghĩa là cây chắc chắn cần nước.

## Nội dung hiển thị

**Tiêu đề:** Kiểm tra đất trước khi tưới

**Vì sao:** Nhu cầu nước thay đổi theo chậu, đất hoặc giá thể, khả năng thoát nước, thời tiết và tình trạng cây.

**Hành động:** Tưới nước

## Hành vi

Nút mở Care Entry với cây và loại hoạt động `watering` đã chọn.

Ứng dụng không điền sẵn lượng nước, phương pháp, độ ẩm đất hoặc kết luận rằng người dùng đã tưới.

Chỉ khi người dùng chọn “Lưu hoạt động” thì lịch sử tưới mới được tạo.

## Điều chỉnh theo thời tiết

- Nếu có mưa đáng kể được dự báo trong cửa sổ còn hiệu lực, giải thích rằng người dùng nên kiểm tra đất và khả năng thoát nước trước khi quyết định.
- Nếu dữ liệu thời tiết thiếu hoặc cũ, không suy đoán mưa và không gắn nhãn “lý tưởng”.
- Không chuyển xác suất mưa thành lượng nước tưới.
