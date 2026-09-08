import fs from 'fs';
import path from 'path';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync('scripts/attachment_data.json', 'utf8'));

async function downloadImages() {
  const rows = data.rows || [];
  console.log(`Checking ${rows.length} attachments for download...`);
  
  for (const row of rows) {
    if (!row.url) continue;
    const localPath = path.join('public', row.url.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      continue;
    }
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const url = 'https://spotline888.org' + row.url;
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
        console.log(`Skipped ${url} (${res.status})`);
      }
    } catch (e) {
      console.error(`Error downloading ${url}:`, e.message);
    }
  }
  console.log('Download complete.');
}

downloadImages();
