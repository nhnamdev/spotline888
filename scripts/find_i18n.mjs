import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Search for login translation key
const idx = bundle.indexOf('zhdl');
console.log('zhdl in index.bundle:', idx);
if (idx !== -1) {
  console.log(bundle.slice(Math.max(0, idx - 200), Math.min(bundle.length, idx + 400)));
}

// Also check where vue-i18n messages are loaded
const i18nIdx = bundle.indexOf('vue-i18n');
console.log('vue-i18n idx:', i18nIdx);
