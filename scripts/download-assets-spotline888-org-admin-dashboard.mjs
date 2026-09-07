import https from 'https';
import fs from 'fs';
import path from 'path';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();
const destDir = path.resolve('public/sites/spotline888-org/admin-dashboard');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const assets = [
  { url: 'https://spotline888.org/uploads/20251210/c3daf0015559501fb836681ca784c977.jpg', file: 'admin_avatar.jpg' },
  { url: 'https://spotline888.org/assets/img/error.svg', file: 'error.svg' },
  { url: 'https://spotline888.org/assets/img/favicon.ico', file: 'favicon.ico' },
];

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(destDir, item.file);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookie
      }
    };
    https.get(item.url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        item.url = res.headers.location;
        return download(item).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.url}: status ${res.statusCode}`);
        return resolve();
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${item.file}`);
        resolve();
      });
    }).on('error', (e) => {
      console.error(`Error downloading ${item.file}:`, e.message);
      resolve();
    });
  });
}

async function run() {
  for (const a of assets) {
    await download(a);
  }
}

run();
