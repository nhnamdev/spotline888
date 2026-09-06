import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const modules = [
  '8de9', 'fe75', 'de53', '16be', '5bf8', '08cf', 'f5c9', '0c51',
  '8981', 'f5c1', 'e864', '16a5', '2b47', '0595', '681b', '87c0', 'ce6d',
  'ff8b', '5c58'
];

for (const m of modules) {
  const p = content.indexOf(`"${m}":`);
  if (p !== -1) {
    console.log(`\n=== Module ${m} ===`);
    console.log(content.slice(p, p + 300));
  } else {
    console.log(`Module ${m} not found in index chunk, checking bundle...`);
  }
}
