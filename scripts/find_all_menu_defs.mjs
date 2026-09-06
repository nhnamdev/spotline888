import fs from 'fs';

const files = [
  'scripts/pages-index-index.js',
  'scripts/index_shared.js',
  'scripts/index.bundle.js',
  'scripts/login.chunk.js'
];

const targets = ['8de9', 'fe75', 'de53', '16be', '5bf8', '08cf', 'f5c9', '0c51'];

for (const t of targets) {
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');
    const p = content.indexOf(`"${t}":`);
    if (p !== -1) {
      console.log(`Found "${t}": in ${f}:`);
      console.log(content.slice(p, p + 200));
      break;
    }
  }
}
