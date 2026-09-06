import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find jsonp / chunk loading logic
const chunkMatch = bundle.match(/return.*?\+.*?\.js/g);
console.log('Chunk match:', chunkMatch);

// Look around where pages-login-login is
const idx = bundle.indexOf('pages-login-login');
if (idx !== -1) {
  console.log(bundle.slice(Math.max(0, idx - 1000), Math.min(bundle.length, idx + 1000)));
}
