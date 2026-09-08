import https from 'https';
import fs from 'fs';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();

function request(path) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': cookie,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    };

    const req = https.request({ hostname: 'spotline888.org', path, method: 'GET', headers }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data).toString('utf-8')
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Fetch general config page
console.log('Fetching /coinht.php/general/config?addtabs=1 ...');
const res1 = await request('/coinht.php/general/config?addtabs=1');
console.log('Status:', res1.statusCode);
fs.writeFileSync('scripts/general_config_inner.html', res1.body);

console.log('Fetching /coinht.php/general/config?ref=addtabs ...');
const res2 = await request('/coinht.php/general/config?ref=addtabs');
console.log('Status:', res2.statusCode);
fs.writeFileSync('scripts/general_config_full.html', res2.body);

console.log('Done.');
