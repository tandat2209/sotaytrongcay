import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'yaml';

const root = path.join(__dirname, '../knowledge/species/grape');
const oldStagesDir = path.join(root, 'stages');
const devDir = path.join(root, 'machines/development');
const prodDir = path.join(root, 'machines/production');

fs.mkdirSync(devDir, { recursive: true });
fs.mkdirSync(prodDir, { recursive: true });

const developmentStages = ['seedling', 'trunk-development', 'trellis-training', 'canopy-formation'];
const productionStages = ['pruning', 'bud-break', 'flowering', 'fruit-set', 'fruit-development', 'ripening', 'harvest', 'recovery'];

function processFile(basename: string, machineId: string, sequence: number, outDir: string) {
  const filePath = path.join(oldStagesDir, basename + '.md');
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  
  delete parsed.data.stage_group;
  delete parsed.data.repeatable;
  
  parsed.data.machine_id = machineId;
  parsed.data.sequence = sequence;

  // Ensure strict field ordering based on schema
  const newData = {
    id: parsed.data.id,
    type: parsed.data.type,
    title: parsed.data.title,
    locale: parsed.data.locale,
    species_id: parsed.data.species_id,
    sequence: parsed.data.sequence,
    version: parsed.data.version,
    status: parsed.data.status,
    machine_id: parsed.data.machine_id,
    primary_objective: parsed.data.primary_objective,
    entry_criteria: parsed.data.entry_criteria,
    exit_criteria: parsed.data.exit_criteria,
    estimated_duration: parsed.data.estimated_duration,
    recommended_playbook: parsed.data.recommended_playbook,
    default_reminder_templates: parsed.data.default_reminder_templates,
    recommended_knowledge_topics: parsed.data.recommended_knowledge_topics,
    references: parsed.data.references
  };

  const yamlStr = yaml.stringify(newData);
  const newContent = `---\n${yamlStr}---\n${parsed.content.trim()}\n`;
  
  fs.writeFileSync(path.join(outDir, basename + '.md'), newContent);
}

// Process Development
developmentStages.forEach((basename, idx) => {
  processFile(basename, 'development', idx + 1, devDir);
});

// Process Production
productionStages.forEach((basename, idx) => {
  processFile(basename, 'production', idx + 1, prodDir);
});

// Delete old folder
fs.rmSync(oldStagesDir, { recursive: true, force: true });

// Update species.md
const speciesPath = path.join(root, 'species.md');
const speciesContent = fs.readFileSync(speciesPath, 'utf8');
const speciesParsed = matter(speciesContent);

delete speciesParsed.data.stage_journey;

speciesParsed.data.state_machines = {
  development: {
    stages: developmentStages.map((basename, idx) => ({
      id: `grape.stage.${basename}`,
      title: idx === 0 ? "Cây con" : idx === 1 ? "Nuôi thân chính" : idx === 2 ? "Leo giàn" : "Tạo tán",
      sequence: idx + 1,
      playbook_status: "review"
    }))
  },
  production: {
    stages: productionStages.map((basename, idx) => {
      const titles: Record<string, string> = {
        'pruning': "Cắt cành",
        'bud-break': "Kích mầm",
        'flowering': "Ra hoa",
        'fruit-set': "Đậu quả",
        'fruit-development': "Nuôi quả",
        'ripening': "Chín quả",
        'harvest': "Thu hoạch",
        'recovery': "Phục hồi"
      };
      return {
        id: `grape.stage.${basename}`,
        title: titles[basename],
        sequence: idx + 1,
        playbook_status: "review"
      };
    })
  }
};

const newSpeciesYaml = yaml.stringify(speciesParsed.data);
const newSpeciesContent = `---\n${newSpeciesYaml}---\n${speciesParsed.content.trim()}\n`;
fs.writeFileSync(speciesPath, newSpeciesContent);

console.log("Migration complete.");
