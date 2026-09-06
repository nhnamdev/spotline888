import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const idx = js.indexOf('"8981":');
if (idx !== -1) {
  console.log(js.substring(idx, idx + 1500));
}
