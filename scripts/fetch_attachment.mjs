import fs from 'fs';
import https from 'https';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();

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
  console.log('Fetching HTML for general/attachment?addtabs=1...');
  const resHtml = await fetchUrl('https://spotline888.org/coinht.php/general/attachment?addtabs=1');
  console.log('HTML status:', resHtml.status, 'size:', resHtml.body.length);
  fs.writeFileSync('scripts/attachment_inner.html', resHtml.body);

  console.log('Fetching JSON data for general/attachment table...');
  const resJson = await fetchUrl('https://spotline888.org/coinht.php/general/attachment?sort=id&order=desc&offset=0&limit=50', {
    'X-Requested-With': 'XMLHttpRequest'
  });
  console.log('JSON status:', resJson.status, 'size:', resJson.body.length);
  fs.writeFileSync('scripts/attachment_data.json', resJson.body);

  console.log('Done.');
}

run().catch(console.error);
