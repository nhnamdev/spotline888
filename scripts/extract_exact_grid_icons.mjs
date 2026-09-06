import fs from 'fs';
import path from 'path';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const icons = [
  { id: '8de9', file: 'menu_withdraw.png' }, // user.cj
  { id: 'fe75', file: 'menu_deposit.png' },  // user.rj
  { id: '5bf8', file: 'menu_trade.png' },    // home.menu.trade
  { id: 'f5c9', file: 'menu_messages.png' }, // home.xtxx.xtxx
  { id: '0c51', file: 'menu_about.png' },    // home.menu.help
];

const outDir = 'public/sites/spotline888-org/pages-index-index';

for (const { id, file } of icons) {
  // Find module definition
  const marker = `"${id}":function`
  let idx = js.indexOf(marker);
  if (idx === -1) {
    idx = js.indexOf(`${id}:function`);
  }
  if (idx === -1) {
    console.error(`Could not find ${id}`);
    continue;
  }
  const base64Start = js.indexOf('data:image/png;base64,', idx);
  const base64End = js.indexOf('"', base64Start);
  const base64Data = js.substring(base64Start + 'data:image/png;base64,'.length, base64End);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(path.join(outDir, file), buffer);
  console.log(`Saved ${file} (${buffer.length} bytes)`);
}
