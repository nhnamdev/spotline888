import fs from 'fs';

const content = fs.readFileSync('scripts/login.chunk.js', 'utf8');

// Extract all CSS in login.chunk.js
const cssMatches = content.match(/\[t\.i,\"(.*?)\",\"\"\]/gs) || [];
console.log('CSS matches count:', cssMatches.length);
cssMatches.forEach((m, idx) => {
  console.log(`\n--- CSS block ${idx} ---`);
  // unescape newlines
  const css = m.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  console.log(css);
  fs.writeFileSync(`scripts/login_extracted_${idx}.css`, css);
});

// Extract full template and script
fs.writeFileSync('scripts/login.chunk.formatted.js', content);
