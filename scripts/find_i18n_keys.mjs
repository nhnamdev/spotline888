import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const tMatches = [...js.matchAll(/\$t\(\s*["']([^"']+)["']\s*\)/g)].map(m => m[1]);
console.log('Unique $t calls in index:', [...new Set(tMatches)]);

// Also check unicode escapes like \u51fa\u91d1 (出金)
function toUnicode(str) {
  return str.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
}
console.log('Unicode of 出金:', toUnicode('出金'));
console.log('Contains unicode 出金:', js.includes(toUnicode('出金')));

// Also check index_extracted i18n or accurate_11_langs.json
if (fs.existsSync('scripts/index_i18n_keys.json')) {
  console.log('index_i18n_keys.json:', fs.readFileSync('scripts/index_i18n_keys.json', 'utf8'));
}
