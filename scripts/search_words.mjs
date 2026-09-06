import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const words = ['出金', '入金', '系统消息', '关于我们', '交易'];
for (const w of words) {
  let pos = 0;
  while ((pos = js.indexOf(w, pos)) !== -1) {
    console.log(`Found "${w}" at index ${pos}`);
    console.log(js.substring(Math.max(0, pos - 200), Math.min(js.length, pos + 200)));
    pos += w.length;
  }
}
