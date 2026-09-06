import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Find style modules in JS
let idx = 0;
while ((idx = js.indexOf('.tui-recommend', idx)) !== -1) {
  console.log(`Found .tui-recommend at ${idx}:`);
  console.log(js.substring(idx - 100, idx + 800));
  idx += 14;
}

let idx2 = 0;
while ((idx2 = js.indexOf('.func-card', idx2)) !== -1) {
  console.log(`Found .func-card at ${idx2}:`);
  console.log(js.substring(idx2 - 100, idx2 + 800));
  idx2 += 10;
}
