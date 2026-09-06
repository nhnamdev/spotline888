import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Find all css strings in chunks inside pages-index-index.js
// Look for push([t.i, "...", ""])
const regex = /\[t\.i,\s*"([\s\S]*?)",\s*""\]/g;
let m;
let cssTotal = '';
while ((m = regex.exec(content)) !== null) {
  const unescaped = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  cssTotal += '\n' + unescaped;
}

console.log('Total CSS length found in pages-index-index.js:', cssTotal.length);
fs.writeFileSync('scripts/index_full_styles.css', cssTotal);
