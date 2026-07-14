import * as fs from "fs";
let content = fs.readFileSync("scripts/knowledge/serialize.ts", "utf8");
content = content.replace(
  "    let lifecycleId = s.lifecycleId;\n    let lifecycleId = s.lifecycleId;",
  "    let lifecycleId = s.lifecycleId;",
);
fs.writeFileSync("scripts/knowledge/serialize.ts", content);
