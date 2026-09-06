import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Find all CSS in pages-index-index.js by looking for data-v-5ea82324 or style blocks
const p = content.indexOf('5ea82324');
console.log('Found 5ea82324 at:', p);

// search for webpack CSS exports: e.exports = ...
const cssSections = [];
const regex = /(?:uni-page-body|\.container|\.home|\.banner|\.header|\.nav|\.notice|\.card|\.tab)[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(content)) !== null) {
  cssSections.push(m[0]);
}

console.log('CSS sections found:', cssSections.length);
fs.writeFileSync('scripts/index_css_sections.txt', cssSections.join('\n'));
console.log(cssSections.slice(0, 10));
