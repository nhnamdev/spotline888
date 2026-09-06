import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const p = content.indexOf('.tui-header');
console.log('p of .tui-header:', p);
if (p !== -1) {
  console.log(content.slice(p, p + 3000));
}
