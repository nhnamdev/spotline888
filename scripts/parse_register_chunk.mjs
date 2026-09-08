import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

// Let's print the entire content or inspect the modules
fs.writeFileSync('scripts/register.chunk.formatted.js', content);

// Extract modules by finding keys
const moduleKeys = [];
const regex = /"([0-9a-fA-F]{4})":\s*function/g;
let m;
while ((m = regex.exec(content)) !== null) {
  moduleKeys.push(m[1]);
}
console.log('Modules found:', moduleKeys);

// Let's find template functions (render function) and script functions
// In vue-loader: "f213" might be template, "49f9" might be script
for (const key of moduleKeys) {
  const start = content.indexOf(`"${key}":function`);
  console.log(`\n--- MODULE ${key} (start: ${start}) ---`);
  console.log(content.slice(start, start + 1200));
}
