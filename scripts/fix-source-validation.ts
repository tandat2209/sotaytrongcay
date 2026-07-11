import * as fs from 'fs';

let content = fs.readFileSync('scripts/knowledge/__tests__/source-validation.test.ts', 'utf8');

// Fix species mock
content = content.replace(
  '  development:\n    stages:\n',
  '  development:\n    title: Dev\n    repeatable: false\n    initial_stage_id: dev1\n    stages:\n'
);
content = content.replace(
  '  production:\n    stages:\n',
  '  production:\n    title: Prod\n    repeatable: true\n    initial_stage_id: prod1\n    stages:\n'
);

// Fix recommended_playbook
content = content.replace('recommended_playbook: playbook.grape\n', '');

fs.writeFileSync('scripts/knowledge/__tests__/source-validation.test.ts', content);
console.log('Fixed source-validation.test.ts');
