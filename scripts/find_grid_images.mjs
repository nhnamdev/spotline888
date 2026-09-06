import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const matches = js.match(/static\/[a-zA-Z0-9_\-\.\/]+/g) || [];
console.log('Unique static matches:');
console.log([...new Set(matches)]);

// Let's also check menu items / grid items defined in data or render
const gridPattern = /[\w]+\s*:\s*\[\{[\s\S]{1,500}\}\]/g;
// or look for 出金, 入金, 客服
for (const word of ['出金', '入金', '客服', '关于', '关于我们', '系统消息', '交易']) {
  const idx = js.indexOf(word);
  if (idx !== -1) {
    console.log(`\nFound "${word}" around index ${idx}:`);
    console.log(js.substring(Math.max(0, idx - 150), Math.min(js.length, idx + 150)));
  }
}
