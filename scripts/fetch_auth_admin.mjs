import fs from 'fs';
import https from 'https';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8');

function fetchUrl(url, headers = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    https.get(url, {
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextUrl = res.headers.location;
        if (nextUrl.startsWith('/')) {
          nextUrl = 'https://spotline888.org' + nextUrl;
        }
        console.log('Redirecting to:', nextUrl);
        return resolve(fetchUrl(nextUrl, headers, maxRedirects - 1));
      }
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data) });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching HTML for auth/admin?addtabs=1...');
  const resHtml = await fetchUrl('https://spotline888.org/coinht.php/auth/admin?addtabs=1');
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
