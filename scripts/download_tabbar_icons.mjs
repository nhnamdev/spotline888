import fs from 'fs';
import path from 'path';

const outputDir = 'public/sites/spotline888-org/pages-index-index';

async function downloadTabbarIcons() {
  const tabIcons = [
    'static/tabbar/index_active.png',
    'static/tabbar/index.png',
    'static/tabbar/chanpin.png',
    'static/tabbar/chanpin_active.png',
    'static/tabbar/yue.png',
    'static/tabbar/yue_active.png',
    'static/tabbar/my.png',
    'static/tabbar/my_active.png',
  ];

  for (const f of tabIcons) {
    const url = `https://spotline888.org/${f}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const buf = Buffer.from(await res.arrayBuffer());
        const filename = path.basename(f);
        fs.writeFileSync(path.join(outputDir, filename), buf);
        console.log(`Saved ${filename} (${buf.length} bytes)`);
      } else {
        console.log(`Status for ${f}: ${res.status}`);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  // Also extract those specific base64 images from index_network_urls.json lines 179, 183, 187, 191, 195, 99
  const urls = JSON.parse(fs.readFileSync('scripts/index_network_urls.json', 'utf8'));
  const b64Urls = urls.filter(u => u.url.startsWith('data:image/png;base64,'));
  console.log('Found base64 png images in network log:', b64Urls.length);
  b64Urls.forEach((u, i) => {
    const data = u.url.split(';base64,').pop();
    fs.writeFileSync(path.join(outputDir, `grid_icon_${i}.png`), Buffer.from(data, 'base64'));
    console.log(`Saved grid_icon_${i}.png`);
  });
}

downloadTabbarIcons().catch(console.error);
