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
  console.log('Fetching HTML for category?addtabs=1...');
  const resHtml = await fetchUrl('https://spotline888.org/coinht.php/category?addtabs=1');
  console.log('HTML status:', resHtml.status, 'size:', resHtml.body.length);
  fs.writeFileSync('scripts/category_inner.html', resHtml.body);

  console.log('Fetching JSON data for category table...');
  const resJson = await fetchUrl('https://spotline888.org/coinht.php/category?sort=weigh&order=desc&offset=0&limit=100', {
    'X-Requested-With': 'XMLHttpRequest'
  });
  console.log('JSON status:', resJson.status, 'size:', resJson.body.length);
  fs.writeFileSync('scripts/category_data.json', resJson.body);

  console.log('Fetching backend/category.js...');
  const resJs = await fetchUrl('https://spotline888.org/assets/js/backend/category.js');
  console.log('JS status:', resJs.status, 'size:', resJs.body.length);
  fs.writeFileSync('scripts/backend_category.js', resJs.body);

  console.log('Done.');
}

run().catch(console.error);
