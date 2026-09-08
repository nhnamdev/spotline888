import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

// Find all object keys: either "xxxx": or xxxx:
const keyRegex = /[,{]([0-9a-zA-Z_"$]+):function/g;
let m;
const keys = [];
while ((m = keyRegex.exec(content)) !== null) {
  keys.push(m[1]);
}
console.log('All keys:', keys);
