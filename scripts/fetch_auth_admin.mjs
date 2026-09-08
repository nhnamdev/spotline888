import fs from 'fs';
import https from 'https';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data) });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching HTML for auth/admin...');
  const resHtml = await fetchUrl('https://spotline888.org/coinht.php/auth/admin?ref=addtabs');
  console.log('HTML status:', resHtml.status, 'size:', resHtml.body.length);
  fs.writeFileSync('scripts/auth_admin_inner.html', resHtml.body);

  console.log('Fetching JSON data for auth/admin table...');
  const resJson = await fetchUrl('https://spotline888.org/coinht.php/auth/admin?sort=id&order=asc&offset=0&limit=10', {
    'X-Requested-With': 'XMLHttpRequest'
  });
  console.log('JSON status:', resJson.status, 'size:', resJson.body.length);
  fs.writeFileSync('scripts/auth_admin_data.json', resJson.body);
  console.log('JSON Content preview:', resJson.body.toString('utf-8').slice(0, 500));
}

run().catch(console.error);
