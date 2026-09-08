import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find all occurrences of "pages-login-register"
let idx = 0;
while ((idx = content.indexOf('pages-login-register', idx)) !== -1) {
  console.log('Found at', idx, ':', content.slice(Math.max(0, idx - 80), idx + 120));
  idx += 'pages-login-register'.length;
}
