import fs from 'fs';
import path from 'path';

const indexJs = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const bundleJs = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const outputDir = 'public/sites/spotline888-org/pages-index-index';
fs.mkdirSync(outputDir, { recursive: true });

// 1. Extract base64 image modules from indexJs and bundleJs
const base64Regex = /"([a-f0-9]+)":function\(t,e[^)]*\)\{t\.exports="(data:image\/[a-zA-Z]+;base64,[^"]+)"\}/g;
let m;
let count = 0;
while ((m = base64Regex.exec(indexJs)) !== null) {
  const modId = m[1];
  const b64 = m[2];
  const data = b64.split(';base64,').pop();
  fs.writeFileSync(path.join(outputDir, `icon_${modId}.png`), Buffer.from(data, 'base64'));
  console.log(`Saved base64 icon: icon_${modId}.png`);
  count++;
}
while ((m = base64Regex.exec(bundleJs)) !== null) {
  const modId = m[1];
  const b64 = m[2];
  const data = b64.split(';base64,').pop();
  fs.writeFileSync(path.join(outputDir, `icon_${modId}.png`), Buffer.from(data, 'base64'));
  console.log(`Saved base64 icon from bundle: icon_${modId}.png`);
  count++;
}
console.log(`Total base64 icons saved: ${count}`);

// 2. Download static image assets
async function downloadAssets() {
  const staticFiles = [
    'static/logo.png',
    'static/laba.png',
    'static/kefu.png',
    'static/6.png',
    'static/up_0.png',
    'static/up_1.png',
    'static/up_2.png',
    'static/up_3.png',
    'static/down_0.png',
    'static/down_1.png',
    'static/down_2.png',
    'static/down_3.png',
    'static/sy/introduce-bg.png',
    'static/line-circle.png'
  ];

  for (const f of staticFiles) {
    const url = `https://spotline888.org/${f}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const buf = Buffer.from(await res.arrayBuffer());
        const filename = path.basename(f);
        fs.writeFileSync(path.join(outputDir, filename), buf);
        console.log(`Downloaded ${f} -> ${filename} (${buf.length} bytes)`);
      } else {
        console.log(`Failed to download ${f}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${f}:`, e.message);
    }
  }

  // 3. Download banners from api__index_index.json
  const indexData = JSON.parse(fs.readFileSync('scripts/api__index_index.json', 'utf8'));
  const banners = indexData.data?.bannerList || [];
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    const bUrl = `https://spotline888.org${b.image}`;
    try {
      const res = await fetch(bUrl);
      if (res.status === 200) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(outputDir, `banner_${i}.jpg`), buf);
        console.log(`Downloaded banner_${i}.jpg (${buf.length} bytes)`);
      }
    } catch (e) {
      console.error(`Error downloading banner ${b.image}:`, e.message);
    }
  }

  // 4. Download crypto icons from api__index_goods.json
  const goodsData = JSON.parse(fs.readFileSync('scripts/api__index_goods.json', 'utf8'));
  const goods = goodsData.data || [];
  for (const g of goods) {
    if (g.image) {
      const gUrl = `https://spotline888.org${g.image}`;
      try {
        const res = await fetch(gUrl);
        if (res.status === 200) {
          const buf = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(path.join(outputDir, `coin_${g.code.toLowerCase()}.png`), buf);
          console.log(`Downloaded coin_${g.code.toLowerCase()}.png`);
        }
      } catch (e) {
        console.error(`Error downloading coin ${g.code}:`, e.message);
      }
    }
  }
}

downloadAssets().catch(console.error);
