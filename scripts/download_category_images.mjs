import fs from 'fs';
import path from 'path';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf8').trim();

const images = [
  '/uploads/20250817/da2366df80bfc80ff3cb5d923373aa1f.jpg',
  '/uploads/20251210/7d1a6e22287f5cfe705e5eaad36a0e06.jpg',
  '/uploads/20251210/4c39d1b800b5752e0a605f6d3afc570e.jpg',
  '/uploads/20251210/08eb6192fb91135fd27da0022175af7a.jpg',
  '/uploads/20251210/777d251a0c52a4e2f4fe5f35d7e69434.jpg',
  '/uploads/20251210/8a7d4cc4edbf1cdb3930b5ff016135f0.jpg'
];

async function downloadAll() {
  for (const imgPath of images) {
    const localPath = path.join('public', imgPath);
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const url = 'https://spotline888.org' + imgPath;
    console.log(`Downloading ${url} -> ${localPath}...`);
    try {
      const res = await fetch(url, {
        headers: {
          'Cookie': cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));
        console.log(`Saved ${localPath} (${buffer.byteLength} bytes)`);
      } else {
        console.error(`Failed ${url}: ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${url}:`, e);
    }
  }
}

downloadAll();
