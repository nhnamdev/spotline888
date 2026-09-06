import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const idx = 103773;
const slice = js.substring(idx - 3000, idx + 3000);
fs.writeFileSync('scripts/grid_block.txt', slice);
console.log('Saved grid_block.txt');
