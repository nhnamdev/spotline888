import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('upImage', pos)) !== -1) {
  console.log(`Found "upImage" at ${pos}:`);
  console.log(js.substring(Math.max(0, pos - 150), Math.min(js.length, pos + 250)));
  pos += 7;
}
