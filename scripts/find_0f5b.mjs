import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const idx = bundle.indexOf('"0f5b":');
console.log('0f5b idx:', idx);
if (idx !== -1) {
  console.log(bundle.slice(idx, idx + 1500));
}
