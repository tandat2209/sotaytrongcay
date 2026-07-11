import * as fs from 'fs';

let content = fs.readFileSync('scripts/knowledge/__tests__/compiler.integration.test.ts', 'utf8');

// Replace stateMachines with lifecycles everywhere
content = content.replace(/stateMachines/g, 'lifecycles');

// Fix the cross-lifecycle mock stages
content = content.replace(/development: { stages: \[\{ id: "stage\.trunk", title: "Nuôi thân", sequence: 1, playbookStatus: "approved" \}\] },\n\s*production: \{ stages: \[\] \}/, 'development: { stages: [{ id: "stage.trunk", title: "Nuôi thân", sequence: 1, playbookStatus: "approved", transitions: ["stage.prod"] }] },\n      production: { stages: [{ id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: [] }] }');

// In ineligible test
content = content.replace(/development: { stages: \[\{ id: "stage\.dev", title: "Dev", sequence: 1, playbookStatus: "approved", transitions: \["stage\.prod"\] \}\] },\n\s*production: \{ stages: \[\{ id: "stage\.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: \[\] \}\] \}/g, 'development: { stages: [{ id: "stage.review", title: "Review Stage", sequence: 1, playbookStatus: "review", transitions: ["stage.prod"] }] },\n          production: { stages: [{ id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: [] }] }');

fs.writeFileSync('scripts/knowledge/__tests__/compiler.integration.test.ts', content);

console.log('Fixed compiler integration test');
