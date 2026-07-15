const configCopy = {
  "app.name": "Sổ tay trồng cây",
  "app.permissions.camera":
    "Cho phép Sổ tay trồng cây dùng camera để chụp ảnh cây.",
  "app.permissions.photos":
    "Cho phép Sổ tay trồng cây truy cập ảnh để lưu vào nhật ký.",
};

function configT(key) {
  return configCopy[key];
}

module.exports = { configT };
