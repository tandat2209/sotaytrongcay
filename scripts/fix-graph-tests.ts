import * as fs from 'fs';

const path = 'scripts/knowledge/__tests__/graph-validation.test.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/state_machines/g, 'lifecycles');
content = content.replace(/stateMachines/g, 'lifecycles');

content = content.replace(/sequence: \d+,\n\s*machineId: "[^"]+",\n/g, '');

content = content.replace(/flags non-contiguous sequences in species stage journey/g, 'flags missing cross-lifecycle transition');

content = content.replace(/field: "stateMachines\.development"/g, 'field: "lifecycles"');

fs.writeFileSync(path, content);
console.log('Fixed graph validation tests');
