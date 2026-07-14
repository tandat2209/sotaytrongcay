import * as fs from "fs";

// 1. species.schema.json
const speciesSchemaPath = "knowledge/_schemas/species.schema.json";
const speciesSchema = JSON.parse(fs.readFileSync(speciesSchemaPath, "utf8"));

const lifecycleProps = {
  title: { type: "string", minLength: 1 },
  repeatable: { type: "boolean" },
  initial_stage_id: { type: "string" },
  stages: {
    type: "array",
    minItems: 1,
    items: { $ref: "#/$defs/stage_journey_item" },
  },
};
const lifecycleRequired = ["title", "repeatable", "initial_stage_id", "stages"];

speciesSchema.properties.lifecycles.properties.development.properties =
  lifecycleProps;
speciesSchema.properties.lifecycles.properties.development.required =
  lifecycleRequired;
speciesSchema.properties.lifecycles.properties.production.properties =
  lifecycleProps;
speciesSchema.properties.lifecycles.properties.production.required =
  lifecycleRequired;

// Update transitions in stage_journey_item
speciesSchema.$defs.stage_journey_item.properties.transitions = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    required: ["to"],
    properties: {
      to: { type: "string" },
      condition: { type: "string" },
    },
  },
};

fs.writeFileSync(
  speciesSchemaPath,
  JSON.stringify(speciesSchema, null, 2) + "\n",
);

// 2. mobile-bundle.schema.json
const bundleSchemaPath = "knowledge/_schemas/mobile-bundle.schema.json";
const bundleSchema = JSON.parse(fs.readFileSync(bundleSchemaPath, "utf8"));

const bundleLifecycleProps = {
  title: { type: "string", minLength: 1 },
  repeatable: { type: "boolean" },
  initialStageId: { type: "string" },
  stages: {
    type: "array",
    items: { $ref: "#/$defs/stage_journey_item" },
  },
};
const bundleLifecycleRequired = [
  "title",
  "repeatable",
  "initialStageId",
  "stages",
];

bundleSchema.properties.species.items.properties.lifecycles.properties.development.properties =
  bundleLifecycleProps;
bundleSchema.properties.species.items.properties.lifecycles.properties.development.required =
  bundleLifecycleRequired;
bundleSchema.properties.species.items.properties.lifecycles.properties.production.properties =
  bundleLifecycleProps;
bundleSchema.properties.species.items.properties.lifecycles.properties.production.required =
  bundleLifecycleRequired;

// Update transitions in stage_journey_item
bundleSchema.$defs.stage_journey_item.properties.transitions = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    required: ["to"],
    properties: {
      to: { type: "string" },
      condition: { type: "string" },
    },
  },
};

// Remove transitions from stagePlaybooks
delete bundleSchema.properties.stagePlaybooks.items.properties.transitions;

// Remove recommendedPlaybook from stagePlaybooks
delete bundleSchema.properties.stagePlaybooks.items.properties
  .recommendedPlaybook;
bundleSchema.properties.stagePlaybooks.items.required =
  bundleSchema.properties.stagePlaybooks.items.required.filter(
    (r: string) => r !== "recommendedPlaybook",
  );

fs.writeFileSync(
  bundleSchemaPath,
  JSON.stringify(bundleSchema, null, 2) + "\n",
);

// 3. stage-playbook.schema.json
const playbookSchemaPath = "knowledge/_schemas/stage-playbook.schema.json";
const playbookSchema = JSON.parse(fs.readFileSync(playbookSchemaPath, "utf8"));

delete playbookSchema.properties.recommended_playbook;
playbookSchema.required = playbookSchema.required.filter(
  (r: string) => r !== "recommended_playbook",
);

fs.writeFileSync(
  playbookSchemaPath,
  JSON.stringify(playbookSchema, null, 2) + "\n",
);

console.log("Schemas updated.");
