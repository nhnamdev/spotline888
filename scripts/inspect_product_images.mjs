import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const idx = js.indexOf('upImage');
if (idx !== -1) {
  console.log(js.substring(idx - 200, idx + 1000));
}
