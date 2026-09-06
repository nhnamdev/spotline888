import fs from 'fs';

const goods = JSON.parse(fs.readFileSync('scripts/api__index_goods.json', 'utf8'));

function calculateSvgPath(priceList, width = 100, height = 25) {
  const c = priceList.map(t => parseFloat(t.close)).reverse();
  const d = c.reduce((t, e) => t + e, 0) / c.length;
  const l = Math.sqrt(c.map(t => Math.pow(t - d, 2)).reduce((t, e) => t + e, 0) / c.length);
  const u = 1.2 * l;
  const p = d - u;
  const f = d + u;
  const v = f - p || 1;
  const m = width / (c.length - 1);
  const h = c.map((t, e) => ({
    x: e * m,
    y: 0.15 * height + ((f - Math.max(p, Math.min(f, t))) / v) * (0.7 * height),
  }));

  let linePath = `M ${h[0].x.toFixed(2)} ${h[0].y.toFixed(2)}`;
  for (let n = 0; n < h.length - 1; n++) {
    const midX = (h[n].x + h[n + 1].x) / 2;
    const midY = (h[n].y + h[n + 1].y) / 2;
    const cp1x = h[n].x + (midX - h[n].x) / 3;
    const cp1y = h[n].y;
    const cp2x = h[n].x + (2 * (midX - h[n].x)) / 3;
    const cp2y = midY;
    linePath += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  return { linePath, areaPath };
}

const top3 = goods.data.slice(0, 3);
const results = top3.map(item => {
  const { linePath, areaPath } = calculateSvgPath(item.price_list, 100, 25);
  return {
    symbol: item.title,
    price: item.price,
    change: (item.is_z === 1 ? '+' : '') + item.zf,
    isDown: item.is_z !== 1,
    linePath,
    areaPath,
  };
});

fs.writeFileSync('scripts/exact_recommend_products.json', JSON.stringify(results, null, 2));
console.log('Saved exact_recommend_products.json');
