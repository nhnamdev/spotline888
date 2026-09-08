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
  console.log('Fetching HTML for general/profile?addtabs=1...');
  const resHtml = await fetchUrl('https://spotline888.org/coinht.php/general/profile?addtabs=1');
  console.log('HTML status:', resHtml.status, 'size:', resHtml.body.length);
  fs.writeFileSync('scripts/profile_inner.html', resHtml.body);

  console.log('Fetching backend/general/profile.js...');
  const resJs = await fetchUrl('https://spotline888.org/assets/js/backend/general/profile.js');
  console.log('JS status:', resJs.status, 'size:', resJs.body.length);
  fs.writeFileSync('scripts/backend_profile.js', resJs.body);

  // Check if there's any log table or profile data
  console.log('Fetching general/profile/index or logs...');
  const resData = await fetchUrl('https://spotline888.org/coinht.php/general/profile?sort=id&order=desc&offset=0&limit=50', {
    'X-Requested-With': 'XMLHttpRequest'
  });
  console.log('Data status:', resData.status, 'size:', resData.body.length);
  fs.writeFileSync('scripts/profile_data.json', resData.body);

  console.log('Done.');
}

run().catch(console.error);
