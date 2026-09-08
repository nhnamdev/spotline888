import fs from 'fs';
import https from 'https';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data).toString('utf-8') });
      });
    }).on('error', reject);
  });
}

async function run() {
  const addRes = await fetchUrl('https://spotline888.org/coinht.php/yuebao_order/add?addtabs=1');
  console.log('Add status:', addRes.status, 'size:', addRes.body.length);
  fs.writeFileSync('scripts/yuebao_order_add.html', addRes.body);
  console.log('Sample:', addRes.body.substring(0, 400));
}

run().catch(console.error);
