import fs from 'fs';

const txt = fs.readFileSync('scripts/grid_block.txt', 'utf8');
const texts = [...txt.matchAll(/t\._v\("([^"]+)"\)/g)].map(m => m[1]);
console.log('Texts in grid block:', texts);

// Find images with their nearby texts
const imgRegex = /attrs:\{[^\}]*src:([^\},]+)[^\}]*\}/g;
let m;
while ((m = imgRegex.exec(txt)) !== null) {
  const start = Math.max(0, m.index - 50);
  const end = Math.min(txt.length, m.index + 200);
  console.log('--- Image block ---');
  console.log(txt.substring(start, end));
}
