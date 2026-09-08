import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find all occurrences of "pages-login" or "register"
const matches = [];
const regex = /pages-[a-zA-Z0-9_-]+/g;
let m;
while ((m = regex.exec(content)) !== null) {
  if (m[0].includes('login') || m[0].includes('register')) {
    matches.push(m[0]);
  }
}
console.log('Matches:', [...new Set(matches)]);

// Search for jsonp chunk map: e.g. { "pages-login-register": "..." } or chunkId
const chunkMapRegex = /"pages-login-register":\s*"([a-f0-9]+)"/g;
let cm = chunkMapRegex.exec(content);
console.log('Chunk map for register:', cm);

// If not found, let's search for "login/register" or "register"
const regIdx = content.indexOf('register');
console.log('Index of register:', regIdx);
if (regIdx !== -1) {
  console.log('Around register:', content.slice(Math.max(0, regIdx - 100), regIdx + 100));
} else {
  // Let's search for chunk file names in content
  const jsRegex = /[a-zA-Z0-9_.~-]+\.js/g;
  const jsFiles = [];
  let j;
  while ((j = jsRegex.exec(content)) !== null) {
    if (j[0].includes('register') || j[0].includes('login')) {
      jsFiles.push(j[0]);
    }
  }
  console.log('JS files:', [...new Set(jsFiles)]);
}
