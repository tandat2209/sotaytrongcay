import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

const playbooks = globSync('knowledge/species/grape/lifecycles/**/*.md');

playbooks.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace title, sequence, machine_id
  let newContent = content.replace(/^title:.*(\r?\n)/m, '');
  newContent = newContent.replace(/^sequence:.*(\r?\n)/m, '');
  newContent = newContent.replace(/^machine_id:.*(\r?\n)/m, '');

  if (file.includes('bud-break.md')) {
    newContent = newContent.replace('Kích mầm', 'Bật mầm');
    newContent = newContent.replace('Bảo vệ mầm non khỏi côn trùng và nấm bệnh.', 'Theo dõi sự phát triển của mầm và bảo vệ khỏi côn trùng, nấm bệnh.');
    newContent = newContent.replace('Bón phân đạm kích chồi', 'Cung cấp dinh dưỡng kích chồi (nếu cần)');
  }
  
  if (file.includes('pruning.md')) {
    newContent = newContent.replace('Cắt cành', 'Sau cắt cành');
  }

  if (file.includes('harvest.md')) {
    newContent = newContent.replace('Thu hoạch', 'Sẵn sàng thu hoạch');
  }

  if (file.includes('recovery.md')) {
    newContent = newContent.replace('Phục hồi', 'Sau thu hoạch');
  }

  fs.writeFileSync(file, newContent);
});

console.log('Playbooks updated.');
