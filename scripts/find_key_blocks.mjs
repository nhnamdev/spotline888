import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const keys = ['user.cj', 'user.rj', 'home.zxkf', 'home.menu.trade', 'home.xtxx.xtxx', 'home.menu.help'];

for (const k of keys) {
  const idx = js.indexOf(k);
  if (idx !== -1) {
    console.log(`=== KEY: ${k} ===`);
    // Find the enclosing block
    const snippet = js.substring(Math.max(0, idx - 400), Math.min(js.length, idx + 200));
    console.log(snippet);
  }
}
