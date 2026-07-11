import * as fs from 'fs';

// freshness.test.ts
let freshness = fs.readFileSync('scripts/knowledge/__tests__/freshness.test.ts', 'utf8');
freshness = freshness.replace('transitions:\n          - to: "grape.stage.pruning",', 'transitions: [{ to: "grape.stage.pruning" }],');
fs.writeFileSync('scripts/knowledge/__tests__/freshness.test.ts', freshness);

// graph-validation.test.ts
let graphVal = fs.readFileSync('scripts/knowledge/__tests__/graph-validation.test.ts', 'utf8');
// Check around line 25
// Since graph-validation.test.ts had JSON/JS syntax error at 25:28, let's check what it is
const lines = graphVal.split('\n');
console.log('graphVal line 24-26:', lines.slice(23, 27));

// source-validation.test.ts
let sourceVal = fs.readFileSync('scripts/knowledge/__tests__/source-validation.test.ts', 'utf8');
const sourceLines = sourceVal.split('\n');
console.log('sourceVal line 304-306:', sourceLines.slice(303, 307));
