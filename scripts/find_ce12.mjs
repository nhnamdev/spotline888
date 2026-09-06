import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find module ce12
const idx = bundle.indexOf('ce12:function(');
console.log('ce12 snippet:');
console.log(bundle.slice(idx, idx + 1500));
