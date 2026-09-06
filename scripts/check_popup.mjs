import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const idx = js.indexOf('.tui-popup');
console.log('Popup CSS:');
console.log(js.substring(idx, idx + 800));

const idx2 = js.indexOf('popup');
let p = 0;
while ((p = js.indexOf('popup', p)) !== -1) {
  console.log(`Popup in code at ${p}:`);
  console.log(js.substring(Math.max(0, p - 100), Math.min(js.length, p + 300)));
  p += 5;
}
