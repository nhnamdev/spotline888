import fs from 'fs';

const indexJs = fs.readFileSync('scripts/pages-index-index.js', 'utf8');
const bundleJs = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find all image references in indexJs and bundleJs
const regex = /(?:static\/img\/|\/uploads\/)[a-zA-Z0-9_\-\.\/]+\.(?:png|jpg|jpeg|svg|webp|gif)/gi;
const set = new Set();
let m;
while ((m = regex.exec(indexJs)) !== null) set.add(m[0]);
while ((m = regex.exec(bundleJs)) !== null) set.add(m[0]);

console.log('All static / uploads image paths found:', [...set]);
fs.writeFileSync('scripts/index_all_images_list.json', JSON.stringify([...set], null, 2));

// Also search for tabbar config in bundleJs
const tabbarPos = bundleJs.indexOf('"tabBar":');
console.log('tabBar pos in bundle:', tabbarPos);
if (tabbarPos !== -1) {
  console.log(bundleJs.slice(tabbarPos, tabbarPos + 1200));
}
