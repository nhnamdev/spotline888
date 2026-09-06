import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');
const p = content.indexOf('langList:i');
console.log('Pos of langList:i is', p);
if (p !== -1) {
  console.log(content.slice(Math.max(0, p - 800), p + 500));
}
