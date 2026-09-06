import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Search for login
const regex = /login/gi;
let match;
let indices = [];
while ((match = regex.exec(bundle)) !== null) {
  indices.push(match.index);
}

console.log('Login occurrences:', indices.length);

// Find occurrences with surrounding context
for (const idx of indices.slice(0, 15)) {
  const snippet = bundle.slice(Math.max(0, idx - 100), Math.min(bundle.length, idx + 150));
  console.log('--- snippet at', idx, '---');
  console.log(snippet);
}
