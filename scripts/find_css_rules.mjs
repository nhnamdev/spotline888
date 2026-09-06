import fs from 'fs';

const css = fs.readFileSync('scripts/index_bundle.css', 'utf8');
const classes = ['tui-recommend', 'recommend-item', 'product-name', 'product-price', 'product-change', 'k-line-chart', 'func-card', 'func-icon', 'section-title', 'tui-varietyContentItem', 'change-badge'];
for (const c of classes) {
  let idx = 0;
  while ((idx = css.indexOf('.' + c, idx)) !== -1) {
    console.log(`=== Class .${c} at ${idx} ===`);
    console.log(css.substring(idx, Math.min(css.length, idx + 250)));
    idx += c.length + 1;
    break; // only first match
  }
}
