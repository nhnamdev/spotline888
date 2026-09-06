import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const p = content.indexOf('func-card[data-v-81697dce]');
if (p !== -1) {
  console.log(content.slice(p, p + 3500));
}
