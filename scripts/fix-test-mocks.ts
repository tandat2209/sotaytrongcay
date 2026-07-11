import * as fs from 'fs';

// 1. source-validation.test.ts
let sourceVal = fs.readFileSync('scripts/knowledge/__tests__/source-validation.test.ts', 'utf8');
// Fix missing lifecycle properties in the second species test
sourceVal = sourceVal.replace(
`          lifecycles: {
            development: { stages: [] },
            production: { stages: [] }
          },`,
`          lifecycles: {
            development: { title: 'Dev', repeatable: false, initial_stage_id: 'dev1', stages: [] },
            production: { title: 'Prod', repeatable: true, initial_stage_id: 'prod1', stages: [] }
          },`
);
// Fix the markdown frontmatter
sourceVal = sourceVal.replace(
`lifecycles:
  development:
    stages: []
  production:
    stages: []`,
`lifecycles:
  development:
    title: Dev
    repeatable: false
    initial_stage_id: dev1
    stages: []
  production:
    title: Prod
    repeatable: true
    initial_stage_id: prod1
    stages: []`
);
fs.writeFileSync('scripts/knowledge/__tests__/source-validation.test.ts', sourceVal);


// 2. graph-validation.test.ts
let graphVal = fs.readFileSync('scripts/knowledge/__tests__/graph-validation.test.ts', 'utf8');
// Fix all string transitions to object transitions
graphVal = graphVal.replace(/transitions: \["(.*?)"\]/g, 'transitions: [{ to: "$1" }]');
// Fix missing lifecycle metadata
graphVal = graphVal.replace(
  `development: {
              stages: [`,
  `development: {
              title: "Dev",
              repeatable: false,
              initial_stage_id: "grape.stage.trunk-development",
              stages: [`
);
graphVal = graphVal.replace(
  `production: { stages: [] }`,
  `production: { title: "Prod", repeatable: true, initial_stage_id: "prod.start", stages: [] }`
);
graphVal = graphVal.replace(
  `development: {
          stages: [`,
  `development: {
          title: "Dev",
          repeatable: false,
          initial_stage_id: "stage1",
          stages: [`
);
graphVal = graphVal.replace(
  `production: {
          stages: []
        }`,
  `production: { title: "Prod", repeatable: true, initial_stage_id: "prod1", stages: [] }`
);
fs.writeFileSync('scripts/knowledge/__tests__/graph-validation.test.ts', graphVal);


// 3. freshness.test.ts
let freshness = fs.readFileSync('scripts/knowledge/__tests__/freshness.test.ts', 'utf8');
freshness = freshness.replace(
`    lifecycles:
      development:
        stages:`,
`    lifecycles:
      development:
        title: Dev
        repeatable: false
        initial_stage_id: grape.stage.trunk-development
        stages:`
);
freshness = freshness.replace(
`      production:
        stages:`,
`      production:
        title: Prod
        repeatable: true
        initial_stage_id: grape.stage.pruning
        stages:`
);
fs.writeFileSync('scripts/knowledge/__tests__/freshness.test.ts', freshness);

console.log("Fixed mocks");
