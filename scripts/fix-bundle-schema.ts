import * as fs from "fs";

// Fix mobile-bundle.schema.json
const bundleSchemaPath = "knowledge/_schemas/mobile-bundle.schema.json";
const bundleSchema = JSON.parse(fs.readFileSync(bundleSchemaPath, "utf8"));

bundleSchema.$defs.stageJourneyItem.properties.transitions = {
  type: "array",
  items: { type: "string" },
};
bundleSchema.$defs.stagePlaybook.properties.transitions = {
  type: "array",
  items: { type: "string" },
};

fs.writeFileSync(
  bundleSchemaPath,
  JSON.stringify(bundleSchema, null, 2) + "\n",
);

// Fix freshness.test.ts cross-lifecycle transition
let freshnessContent = fs.readFileSync(
  "scripts/knowledge/__tests__/freshness.test.ts",
  "utf8",
);
freshnessContent = freshnessContent.replace(
  /id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "approved"/,
  'id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "approved", transitions: ["stage.prod"]',
);
freshnessContent = freshnessContent.replace(
  /id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved"/,
  'id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: []',
);
fs.writeFileSync(
  "scripts/knowledge/__tests__/freshness.test.ts",
  freshnessContent,
);

// Fix compiler.integration.test.ts cross-lifecycle transition
let compilerTestContent = fs.readFileSync(
  "scripts/knowledge/__tests__/compiler.integration.test.ts",
  "utf8",
);
compilerTestContent = compilerTestContent.replace(
  /id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "approved"/g,
  'id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "approved", transitions: ["stage.prod"]',
);
compilerTestContent = compilerTestContent.replace(
  /id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved"/g,
  'id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: []',
);
compilerTestContent = compilerTestContent.replace(
  /id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "draft"/g,
  'id: "stage.dev", title: "Dev", sequence: 1, playbookStatus: "draft", transitions: ["stage.prod"]',
);
compilerTestContent = compilerTestContent.replace(
  /id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "draft"/g,
  'id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "draft", transitions: []',
);

fs.writeFileSync(
  "scripts/knowledge/__tests__/compiler.integration.test.ts",
  compilerTestContent,
);

console.log("Fixed bundle schema and test mocks");
