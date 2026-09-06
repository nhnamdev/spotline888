import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');

// Print in readable segments
const parts = content.split(/,\s*\"[a-zA-Z0-9_-]+\":/);
console.log('Number of modules in login.chunk.js:', parts.length);

for (let i = 0; i < parts.length; i++) {
  console.log(`\n================ MODULE ${i} ================\n`);
  console.log(parts[i].slice(0, 1500));
}
