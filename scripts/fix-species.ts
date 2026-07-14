import * as fs from "fs";

let content = fs.readFileSync("knowledge/species/grape/species.md", "utf8");

// Update lifecycle definitions
content = content.replace(
  "  development:\n    stages:",
  "  development:\n    title: Sinh trưởng kiến thiết\n    repeatable: false\n    initial_stage_id: grape.stage.seedling\n    stages:",
);
content = content.replace(
  "  production:\n    stages:",
  "  production:\n    title: Chu kỳ sản xuất\n    repeatable: true\n    initial_stage_id: grape.stage.pruning\n    stages:",
);

// Replace transitions
// "        transitions:\n          - grape.stage.trunk-development"
// to
// "        transitions:\n          - to: grape.stage.trunk-development"

content = content.replace(
  /transitions:\n\s+- (grape\.stage\.[a-z-]+)/g,
  "transitions:\n          - to: $1",
);

fs.writeFileSync("knowledge/species/grape/species.md", content);
console.log("Fixed species.md");
