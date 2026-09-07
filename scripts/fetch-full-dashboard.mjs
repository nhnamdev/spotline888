import https from 'https';
import fs from 'fs';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();
console.log('Using cookie:', cookie);

function get(pathStr, currentCookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'spotline888.org',
      path: pathStr,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': currentCookies,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    };

    https.get(options, (res) => {
      console.log(`GET ${pathStr} -> Status: ${res.statusCode}`);
      if (res.headers['set-cookie']) {
        const newCookies = res.headers['set-cookie'].map(c => c.split(';')[0]);
        currentCookies = newCookies.join('; ') + '; ' + currentCookies;
      }
      console.log('Location:', res.headers['location']);

      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers['location']) {
        let nextUrl = res.headers['location'];
        if (nextUrl.startsWith('https://spotline888.org')) {
          nextUrl = nextUrl.replace('https://spotline888.org', '');
        }
        return resolve(get(nextUrl, currentCookies));
      }

      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data),
          cookies: currentCookies
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  // First fetch dashboard: /coinht.php/dashboard?ref=addtabs
  const resDash = await get('/coinht.php/dashboard?ref=addtabs', cookie);
  fs.writeFileSync('scripts/dashboard.html', resDash.body);
  console.log('Dashboard saved! Bytes:', resDash.body.length);

  // Also fetch index layout: /coinht.php/index/index
  const resIndex = await get('/coinht.php/index/index', resDash.cookies);
  fs.writeFileSync('scripts/admin_index.html', resIndex.body);
  console.log('Admin index saved! Bytes:', resIndex.body.length);
}

run().catch(console.error);
