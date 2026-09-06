import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const matches = [...bundle.matchAll(/showToast/g)];
console.log('showToast count:', matches.length);
for (const m of matches.slice(0, 5)) {
  console.log('--- showToast at', m.index);
  console.log(bundle.slice(Math.max(0, m.index - 100), Math.min(bundle.length, m.index + 200)));
}
