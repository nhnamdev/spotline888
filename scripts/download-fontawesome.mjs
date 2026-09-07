import https from 'https';
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/assets/libs/font-awesome');
fs.mkdirSync(path.join(baseDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'fonts'), { recursive: true });

const files = [
  { url: 'https://spotline888.org/assets/libs/font-awesome/css/font-awesome.min.css', dest: 'css/font-awesome.min.css' },
  { url: 'https://spotline888.org/assets/libs/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0', dest: 'fonts/fontawesome-webfont.woff2' },
  { url: 'https://spotline888.org/assets/libs/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0', dest: 'fonts/fontawesome-webfont.woff' },
  { url: 'https://spotline888.org/assets/libs/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0', dest: 'fonts/fontawesome-webfont.ttf' },
];

function download(item) {
  return new Promise((resolve) => {
    const filePath = path.join(baseDir, item.dest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.url}: status ${res.statusCode}`);
        return resolve();
      }
      const stream = fs.createWriteStream(filePath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        console.log(`Downloaded ${item.dest} (${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
    }).on('error', (e) => {
      console.error(e.message);
      resolve();
    });
  });
}

async function run() {
  for (const f of files) {
    await download(f);
  }
}

run();
