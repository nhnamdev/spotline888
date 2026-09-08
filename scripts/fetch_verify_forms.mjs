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
  const editRes = await fetchUrl('https://spotline888.org/coinht.php/verify/edit/ids/197?addtabs=1');
  console.log('Edit status:', editRes.status, 'len:', editRes.body.length);
  fs.writeFileSync('scripts/verify_edit.html', editRes.body);

  const verifyRes = await fetchUrl('https://spotline888.org/coinht.php/verify/verify/ids/197?addtabs=1');
  console.log('Verify status:', verifyRes.status, 'len:', verifyRes.body.length);
  fs.writeFileSync('scripts/verify_detail.html', verifyRes.body);
}

run().catch(console.error);
