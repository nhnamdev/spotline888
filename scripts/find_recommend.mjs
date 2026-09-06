import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('recommend_products', pos)) !== -1) {
  console.log(`Found "recommend_products" at ${pos}:`);
  console.log(js.substring(Math.max(0, pos - 200), Math.min(js.length, pos + 400)));
  pos += 18;
}
