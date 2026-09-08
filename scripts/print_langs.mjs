import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');
console.log(content.slice(157500, 158500));
