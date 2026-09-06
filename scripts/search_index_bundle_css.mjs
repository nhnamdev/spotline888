import fs from 'fs';

const css = fs.readFileSync('scripts/index_bundle.css', 'utf8');

const keywords = ['banner', 'tabbar', 'menu', 'recommend', 'goods', 'notice', 'laba', 'sparkline', 'kefu', '5ea82324'];

for (const k of keywords) {
  const p = css.indexOf(k);
  console.log(`Keyword "${k}" pos:`, p);
  if (p !== -1) {
    console.log(css.slice(Math.max(0, p - 60), p + 250));
  }
}
