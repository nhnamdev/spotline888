import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');
const p = content.indexOf('8f33');
console.log(content.slice(Math.max(0, p - 800), p + 2000));
