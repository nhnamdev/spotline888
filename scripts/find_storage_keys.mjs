import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const regex = /getStorageSync\((?:uni\.)?["']([a-zA-Z0-9_\.]+)["']\)|setStorageSync\((?:uni\.)?["']([a-zA-Z0-9_\.]+)["']/g;
const keys = new Set();
let m;
while ((m = regex.exec(bundle)) !== null) {
  if (m[1]) keys.add(m[1]);
  if (m[2]) keys.add(m[2]);
}

console.log('Keys in index.bundle.js:', [...keys]);

const loginChunk = fs.readFileSync('scripts/login.chunk.js', 'utf8');
const loginKeys = new Set();
while ((m = regex.exec(loginChunk)) !== null) {
  if (m[1]) loginKeys.add(m[1]);
  if (m[2]) loginKeys.add(m[2]);
}
console.log('Keys in login.chunk.js:', [...loginKeys]);

// Look for what login.chunk saves on successful login:
const p = loginChunk.indexOf('setStorageSync');
console.log('login.chunk setStorageSync pos:', p);
if (p !== -1) {
  console.log(loginChunk.slice(p - 100, p + 500));
}
