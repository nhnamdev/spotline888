import fs from 'fs';
import path from 'path';
import https from 'https';

const data = JSON.parse(fs.readFileSync('scripts/verify_data.json', 'utf-8'));
const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();

// Gather image paths from the first 20 rows
const imagesToDownload = new Set();
data.rows.slice(0, 20).forEach(row => {
  if (row.id_img_1 && row.id_img_1.startsWith('/uploads/')) {
    imagesToDownload.add(row.id_img_1);
  }
  if (row.id_img_2 && row.id_img_2.startsWith('/uploads/')) {
    imagesToDownload.add(row.id_img_2);
  }
});

console.log(`Found ${imagesToDownload.size} images to download for verify rows.`);

function downloadFile(relUrl) {
  return new Promise((resolve) => {
    const fullUrl = `https://spotline888.org${relUrl}`;
    const localPath = path.join('public', relUrl.replace(/\//g, path.sep));
    
    if (fs.existsSync(localPath)) {
      // already exists
      resolve(true);
      return;
    }

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    https.get(fullUrl, {
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        console.log(`Failed to download ${fullUrl}: status ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${fullUrl}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  let count = 0;
  for (const img of imagesToDownload) {
    const ok = await downloadFile(img);
    if (ok) count++;
  }
  console.log(`Successfully ensured ${count} images locally.`);
}

run().catch(console.error);
