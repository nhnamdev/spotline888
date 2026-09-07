import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const targetDir = path.resolve('public/sites/spotline888-org/admin-login');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = [
  { url: 'https://spotline888.org/assets/img/loginbg.jpg', file: 'loginbg.jpg' },
  { url: 'https://spotline888.org/assets/img/avatar.png', file: 'avatar.png' },
  { url: 'https://spotline888.org/assets/img/favicon.ico', file: 'favicon.ico' },
  { url: 'https://spotline888.org/index.php?s=/captcha', file: 'captcha.png' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).href;
        }
        return download(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of assets) {
    const dest = path.join(targetDir, item.file);
    try {
      await download(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`Downloaded ${item.file} (${stat.size} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${item.file}:`, e.message);
    }
  }
}

run();
