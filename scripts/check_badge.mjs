import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const idx = js.indexOf('.change-badge');
console.log(js.substring(idx, idx + 500));
