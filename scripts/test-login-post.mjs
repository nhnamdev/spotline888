import https from 'https';
import fs from 'fs';

function request(options, postData = null, cookie = '') {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...(cookie ? { 'Cookie': cookie } : {}),
      ...(postData ? {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Length': Buffer.byteLength(postData)
      } : {})
    };

    const req = https.request({ ...options, headers: { ...options.headers, ...headers } }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  // 1. Get login page
  const res1 = await request({ hostname: 'spotline888.org', path: '/coinht.php/index/login', method: 'GET' });
  const rawCookie = res1.headers['set-cookie'] ? res1.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';
  const html = res1.body.toString('utf-8');
  const token = (html.match(/name="__token__"\s+value="([^"]+)"/) || [])[1];
  console.log('Session cookie:', rawCookie);
  console.log('Token:', token);

  // 2. Fetch captcha image with this session
  const resCap = await request({ hostname: 'spotline888.org', path: '/index.php?s=/captcha', method: 'GET' }, null, rawCookie);
  fs.writeFileSync('scripts/last_captcha.png', resCap.body);
  console.log('Saved captcha to scripts/last_captcha.png, size:', resCap.body.length);

  // 3. Test POST with empty captcha
  const postData = `__token__=${token}&username=admin&password=admin888&captcha=&keeplogin=1`;
  const resPost = await request({ hostname: 'spotline888.org', path: '/coinht.php/index/login', method: 'POST' }, postData, rawCookie);
  console.log('POST status:', resPost.statusCode);
  console.log('POST body:', resPost.body.toString('utf-8'));
}

test().catch(console.error);
