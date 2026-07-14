import * as fs from "fs";

// 1. source-validation.test.ts
let sourceVal = fs.readFileSync(
  "scripts/knowledge/__tests__/source-validation.test.ts",
  "utf8",
);
sourceVal = sourceVal.replace(
  "lifecycles:\n  development:\n    stages: []\n  production:\n    stages: []",
  "lifecycles:\n  development:\n    title: Dev\n    repeatable: false\n    initial_stage_id: dev.start\n    stages: []\n  production:\n    title: Prod\n    repeatable: true\n    initial_stage_id: prod.start\n    stages: []",
);
sourceVal = sourceVal.replace(
  'recommended_playbook: "grape.stage.trellis-training"\n',
  "",
);
fs.writeFileSync(
  "scripts/knowledge/__tests__/source-validation.test.ts",
  sourceVal,
);

// 2. graph-validation.test.ts
let graphVal = fs.readFileSync(
  "scripts/knowledge/__tests__/graph-validation.test.ts",
  "utf8",
);
graphVal = graphVal.replace(
  /transitions: \["stage\.prod"\]/g,
  'transitions: [{ to: "stage.prod" }]',
);
graphVal = graphVal.replace(/transitions: \[\]/g, "transitions: []");
graphVal = graphVal.replace(
  /transitions: \["stage\.unknown"\]/g,
  'transitions: [{ to: "stage.unknown" }]',
);
fs.writeFileSync(
  "scripts/knowledge/__tests__/graph-validation.test.ts",
  graphVal,
);

// 3. compiler.integration.test.ts
let compilerInt = fs.readFileSync(
  "scripts/knowledge/__tests__/compiler.integration.test.ts",
  "utf8",
);
compilerInt = compilerInt.replace(/recommendedPlaybook: "playbook",\n/g, "");
compilerInt = compilerInt.replace(
  /transitions: \["stage\.prod"\]/g,
  'transitions: [{ to: "stage.prod" }]',
);
compilerInt = compilerInt.replace(/transitions: \[\]/g, "transitions: []");

// Add lifecycle metadata to compiler.integration.test.ts mocks
compilerInt = compilerInt.replace(
  /development: \{ stages: /g,
  'development: { title: "Dev", repeatable: false, initialStageId: "stage.dev", stages: ',
);
compilerInt = compilerInt.replace(
  /production: \{ stages: /g,
  'production: { title: "Prod", repeatable: true, initialStageId: "stage.prod", stages: ',
);

// Fix the replace that didn't have stage.dev for initialStageId but might have stage.trunk or stage.review
compilerInt = compilerInt.replace(
  /initialStageId: "stage\.dev", stages: \[\{ id: "stage\.trunk"/g,
  'initialStageId: "stage.trunk", stages: [{ id: "stage.trunk"',
);
compilerInt = compilerInt.replace(
  /initialStageId: "stage\.dev", stages: \[\{ id: "stage\.review"/g,
  'initialStageId: "stage.review", stages: [{ id: "stage.review"',
);
fs.writeFileSync(
  "scripts/knowledge/__tests__/compiler.integration.test.ts",
  compilerInt,
);

// 4. freshness.test.ts
let freshness = fs.readFileSync(
  "scripts/knowledge/__tests__/freshness.test.ts",
  "utf8",
);
freshness = freshness.replace(
  /transitions: \["grape\.stage\.pruning"\]/g,
  'transitions:\n          - to: "grape.stage.pruning"',
);
freshness = freshness.replace(/transitions: \[\]/g, "transitions: []");
freshness = freshness.replace(/recommended_playbook: ".*"\n/g, "");

freshness = freshness.replace(
  "  development:\n    stages:",
  '  development:\n    title: "Dev"\n    repeatable: false\n    initial_stage_id: "grape.stage.trunk-development"\n    stages:',
);
freshness = freshness.replace(
  "  production:\n    stages:",
  '  production:\n    title: "Prod"\n    repeatable: true\n    initial_stage_id: "grape.stage.pruning"\n    stages:',
);

// Expected serialized
freshness = freshness.replace(/recommendedPlaybook: ".*",\n/g, "");
freshness = freshness.replace(
  /transitions: \["grape\.stage\.pruning"\],/g,
  'transitions: [{ to: "grape.stage.pruning" }],',
);
freshness = freshness.replace(/transitions: \[\],/g, "transitions: [],");

freshness = freshness.replace(
  /development: \{\n\s*stages: /g,
  'development: {\n                title: "Dev",\n                repeatable: false,\n                initialStageId: "grape.stage.trunk-development",\n                stages: ',
);
freshness = freshness.replace(
  /production: \{\n\s*stages: /g,
  'production: {\n                title: "Prod",\n                repeatable: true,\n                initialStageId: "grape.stage.pruning",\n                stages: ',
);

fs.writeFileSync("scripts/knowledge/__tests__/freshness.test.ts", freshness);

console.log("Fixed tests");
