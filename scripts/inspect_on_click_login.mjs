import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');
const p = content.indexOf('onClickLogin');
console.log('onClickLogin pos:', p);
if (p !== -1) {
  console.log(content.slice(p - 100, p + 800));
}
