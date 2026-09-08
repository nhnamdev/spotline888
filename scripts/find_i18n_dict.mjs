import fs from 'fs';

const files = ['scripts/chunk-vendors.js', 'scripts/index.bundle.js', 'scripts/shared.chunk.js'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const idx = content.indexOf('zhzc');
  console.log(file, 'has zhzc:', idx);
  if (idx !== -1) {
    console.log(content.slice(Math.max(0, idx - 100), idx + 200));
  }
}
