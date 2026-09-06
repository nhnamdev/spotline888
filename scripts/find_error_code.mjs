import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const idx = bundle.indexOf('yonghumingbucunzai');
console.log('yonghumingbucunzai idx:', idx);
if (idx !== -1) {
  console.log(bundle.slice(Math.max(0, idx - 100), Math.min(bundle.length, idx + 400)));
}
