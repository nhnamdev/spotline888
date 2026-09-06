import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find all occurrences of login.zhdl in index.bundle
const matches = [...bundle.matchAll(/login\.zhdl/g)];
console.log('Matches for login.zhdl:', matches.length);

matches.forEach((m, idx) => {
  console.log(`\n=== Match ${idx} at pos ${m.index} ===`);
  console.log(bundle.slice(Math.max(0, m.index - 500), Math.min(bundle.length, m.index + 800)));
});
