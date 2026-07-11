import * as fs from 'fs';

const bundleSchemaPath = 'knowledge/_schemas/mobile-bundle.schema.json';
const bundleSchema = JSON.parse(fs.readFileSync(bundleSchemaPath, 'utf8'));

// Add transitions to stage_journey_item
bundleSchema.$defs.stage_journey_item.properties.transitions = {
  "type": "array",
  "items": { "type": "string" }
};

// Add transitions to stagePlaybooks items
bundleSchema.properties.stagePlaybooks.items.properties.transitions = {
  "type": "array",
  "items": { "type": "string" }
};

// Add transitions to required arrays if needed? No, not required.

fs.writeFileSync(bundleSchemaPath, JSON.stringify(bundleSchema, null, 2) + '\n');
console.log('Fixed bundle schema transitions');
