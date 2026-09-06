import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// search for all occurrences of pages-index-index
const matches = [...bundle.matchAll(/pages-index-index/g)];
console.log('Occurrences of pages-index-index:', matches.length);
matches.forEach((m, i) => {
  console.log(`\n--- Match ${i} at ${m.index} ---`);
  console.log(bundle.slice(Math.max(0, m.index - 100), Math.min(bundle.length, m.index + 200)));
});
