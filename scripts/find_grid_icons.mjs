import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Find where user.cj is used in template
const p = content.indexOf('user.cj');
console.log('user.cj pos:', p);
if (p !== -1) {
  console.log('Around user.cj:');
  console.log(content.slice(Math.max(0, p - 600), p + 1200));
}
