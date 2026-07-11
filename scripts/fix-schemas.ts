import * as fs from 'fs';

const playbookSchemaPath = 'knowledge/_schemas/stage-playbook.schema.json';
const playbookSchema = JSON.parse(fs.readFileSync(playbookSchemaPath, 'utf8'));

playbookSchema.required = playbookSchema.required.filter((key: string) => !['title', 'sequence', 'machine_id'].includes(key));
delete playbookSchema.properties.title;
delete playbookSchema.properties.sequence;
delete playbookSchema.properties.machine_id;
fs.writeFileSync(playbookSchemaPath, JSON.stringify(playbookSchema, null, 2) + '\n');

const bundleSchemaPath = 'knowledge/_schemas/mobile-bundle.schema.json';
let bundleSchemaStr = fs.readFileSync(bundleSchemaPath, 'utf8');
bundleSchemaStr = bundleSchemaStr.replace(/"stateMachines"/g, '"lifecycles"');
bundleSchemaStr = bundleSchemaStr.replace(/"machineId"/g, '"lifecycleId"');
fs.writeFileSync(bundleSchemaPath, bundleSchemaStr);

console.log('Fixed schemas');
