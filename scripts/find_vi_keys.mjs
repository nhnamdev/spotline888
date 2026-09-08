import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const modStart = content.indexOf('"8b9f":function');
const modEnd = content.indexOf('":function', modStart + 20);
const viText = content.slice(modStart, modEnd);

// Find all occurrences of "login." in viText
const viMatches = [];
const re = /"login\.([a-zA-Z0-9_]+)",\s*"([^"]+)"/g;
let m;
while ((m = re.exec(viText)) !== null) {
  viMatches.push({ key: m[1], val: m[2] });
}
console.log('vi-VN login keys:', viMatches);
