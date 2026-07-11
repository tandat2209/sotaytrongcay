import * as fs from 'fs';

function replaceInFile(path: string, from: RegExp | string, to: string) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(from, to);
  fs.writeFileSync(path, content);
}

replaceInFile('scripts/knowledge/relationship-validator.ts', /stateMachines\?/g, 'lifecycles?');
replaceInFile('scripts/knowledge/relationship-validator.ts', /stateMachines\?/g, 'lifecycles?');
replaceInFile('scripts/knowledge/eligibility.ts', /stateMachines\?/g, 'lifecycles?');
replaceInFile('scripts/knowledge/eligibility.ts', /stateMachines\?/g, 'lifecycles?');
replaceInFile('scripts/knowledge/eligibility.ts', /"stateMachines"/g, '"lifecycles"');

replaceInFile('scripts/knowledge/__tests__/freshness.test.ts', /stateMachines:/g, 'lifecycles:');
replaceInFile('scripts/knowledge/__tests__/freshness.test.ts', /state_machines:/g, 'lifecycles:');

console.log('Fixed ts files');
