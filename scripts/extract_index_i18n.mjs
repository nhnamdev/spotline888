import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const keys = [
  'user.cj',
  'user.rj',
  'home.zxkf',
  'home.menu.trade',
  'home.xtxx.xtxx',
  'home.menu.help',
  'home.recommend_products',
  'home.future_products',
  'market.name',
  'market.latest_price',
  'market.change_24h',
  'app.tabbar.sy',
  'app.tabbar.cp',
  'app.tabbar.yeb',
  'app.tabbar.grzx'
];

const results = {};
for (const k of keys) {
  const re = new RegExp(`["']${k.replace(/\./g, '\\.')}["']\\s*:\\s*["']([^"']+)["']|["']${k.replace(/\./g, '\\.')}["']\\s*,\\s*["']([^"']+)["']`, 'g');
  const matches = [...bundle.matchAll(re)].map(m => m[1] || m[2]);
  results[k] = [...new Set(matches)];
}

console.log(JSON.stringify(results, null, 2));
fs.writeFileSync('scripts/index_i18n_keys.json', JSON.stringify(results, null, 2));
