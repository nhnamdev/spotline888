import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const idx = js.indexOf('底部 Tabbar');
console.log(js.substring(idx, idx + 800));
