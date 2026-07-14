import * as fs from "fs";

let content = fs.readFileSync(
  "scripts/knowledge/stage-graph-validator.ts",
  "utf8",
);

// The block currently looks like:
//           message: `Stage ${item.id} transitions to an unknown stage ${targetId}.`,
//         });
//       }
//     }
//   }

content = content.replace(
  "          });\n      }\n    }\n  }\n\n  return diagnostics;\n}",
  "          });\n        }\n      }\n    }\n  }\n\n  return diagnostics;\n}",
);

fs.writeFileSync("scripts/knowledge/stage-graph-validator.ts", content);
