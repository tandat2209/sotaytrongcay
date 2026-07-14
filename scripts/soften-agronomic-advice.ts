import * as fs from "fs";

const flowerPath = "knowledge/species/grape/lifecycles/production/flowering.md";
let flowerContent = fs.readFileSync(flowerPath, "utf8");
flowerContent = flowerContent.replace(
  "DỪNG bón phân",
  "Giảm thiểu hoặc hạn chế bón phân tùy tình trạng cây",
);
fs.writeFileSync(flowerPath, flowerContent);

const ripeningPath =
  "knowledge/species/grape/lifecycles/production/ripening.md";
let ripeningContent = fs.readFileSync(ripeningPath, "utf8");
ripeningContent = ripeningContent.replace(
  "Chỉ bón Kali (K), dừng Đạm (N)",
  "Ưu tiên Kali (K), hạn chế Đạm (N) để trái chuyển màu tốt",
);
fs.writeFileSync(ripeningPath, ripeningContent);

const canopyPath =
  "knowledge/species/grape/lifecycles/development/canopy-formation.md";
let canopyContent = fs.readFileSync(canopyPath, "utf8");
canopyContent = canopyContent.replace(
  "Ngừng bón phân đạm (N)",
  "Giảm hoặc hạn chế phân đạm (N) khi đã đủ lá",
);
fs.writeFileSync(canopyPath, canopyContent);

console.log("Softened agronomic advice.");
