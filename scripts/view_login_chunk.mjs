import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');
console.log('Login chunk content preview:');
console.log(content.slice(0, 3000));
