import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Find all strings containing CSS selectors
const cssRegex = /(?:\[[a-zA-Z0-9_\.]+\.i,\s*\"|\"uni-page-body|\"\.display|\"\.container|\"\.nav)([\s\S]*?)(?:\"\,|\"\])/g;
let m;
let allExtracted = '';
// Or find all occurrences of css blocks
const blocks = content.split('/* 颜色变量 */');
console.log('Blocks count split by 颜色变量:', blocks.length);

blocks.slice(1).forEach((b, i) => {
  const end = b.indexOf('",""]');
  const css = b.slice(0, end !== -1 ? end : 5000).replace(/\\n/g, '\n').replace(/\\"/g, '"');
  allExtracted += `\n/* === Block ${i} === */\n` + css;
});

console.log('Extracted CSS total length:', allExtracted.length);
fs.writeFileSync('scripts/index_real_styles.css', allExtracted);
