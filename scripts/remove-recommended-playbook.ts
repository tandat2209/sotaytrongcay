import * as fs from "fs";
import * as path from "path";

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".md")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/recommended_playbook:.*?\n/, "");
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir("knowledge/species/grape/lifecycles/");
console.log("Removed recommended_playbook");
