import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// find all $t("...") or t.$t("...")
const regex = /\$t\(["']([^"']+)["']\)/g;
const keys = new Set();
let m;
while ((m = regex.exec(content)) !== null) {
  keys.add(m[1]);
}

console.log('Keys used in pages-index-index.js:', [...keys]);

// Search for icon or image bindings in template
const iconRegex = /(?:icon|img|image|src)[^"':]*["':]\s*["']([^"']+)["']/gi;
const iconMatches = new Set();
while ((m = iconRegex.exec(content)) !== null) {
  if (m[1].length < 100 && !m[1].startsWith('http') && !m[1].startsWith('//')) {
    iconMatches.add(m[1]);
  }
}
console.log('Icon matches in pages-index-index.js:', [...iconMatches].slice(0, 30));

// Also let's inspect the template of pages-index-index.js!
const renderPos = content.indexOf('render:function');
console.log('render pos:', renderPos);
if (renderPos !== -1) {
  console.log('Render function snippet:');
  console.log(content.slice(renderPos, renderPos + 3000));
}
