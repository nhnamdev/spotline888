import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const matches = [...bundle.matchAll(/login\.zhdl/g)];

for (let i = 0; i <= 4; i++) {
  const m = matches[i];
  if (!m) continue;
  console.log(`\n=== Match ${i} at pos ${m.index} ===`);
  console.log(bundle.slice(Math.max(0, m.index - 200), Math.min(bundle.length, m.index + 600)));
}
