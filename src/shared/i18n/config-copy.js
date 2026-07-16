const configCopy = {
  "app.name": "Sổ tay trồng cây",
  "app.permissions.camera":
    "Cho phép Sổ tay trồng cây dùng camera để chụp ảnh cây.",
  "app.permissions.photos":
    "Cho phép Sổ tay trồng cây truy cập ảnh để lưu vào nhật ký.",
  "app.permissions.location":
    "Cho phép Sổ tay trồng cây dùng vị trí hiện tại để hiển thị thời tiết nơi bạn trồng cây.",
};

function configT(key) {
  return configCopy[key];
}

module.exports = { configT };
