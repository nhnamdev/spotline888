import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const slice = js.substring(19800, 22000);
fs.writeFileSync('scripts/recommend_render.txt', slice);
console.log('Saved recommend_render.txt');
