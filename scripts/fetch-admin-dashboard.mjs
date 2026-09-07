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

const action = process.argv[2];

if (action === 'step1') {
  // Step 1: get login page and captcha
  const res1 = await request({ hostname: 'spotline888.org', path: '/coinht.php/index/login', method: 'GET' });
  const rawCookie = res1.headers['set-cookie'] ? res1.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';
  const html = res1.body.toString('utf-8');
  const token = (html.match(/name="__token__"\s+value="([^"]+)"/) || [])[1];

  const resCap = await request({ hostname: 'spotline888.org', path: '/index.php?s=/captcha', method: 'GET' }, null, rawCookie);
  fs.writeFileSync('scripts/live_captcha.png', resCap.body);

  fs.writeFileSync('scripts/session_state.json', JSON.stringify({ rawCookie, token }));
  console.log('STEP 1 OK. Cookie:', rawCookie, 'Token:', token);
} else if (action === 'step2') {
  const captcha = process.argv[3];
  const state = JSON.parse(fs.readFileSync('scripts/session_state.json', 'utf-8'));
  console.log('Submitting with captcha:', captcha, 'Cookie:', state.rawCookie);

  const postData = `__token__=${state.token}&username=admin&password=admin888&captcha=${encodeURIComponent(captcha)}&keeplogin=1`;
  const resPost = await request({ hostname: 'spotline888.org', path: '/coinht.php/index/login', method: 'POST' }, postData, state.rawCookie);
  console.log('POST status:', resPost.statusCode);
  const respBody = resPost.body.toString('utf-8');
  console.log('POST body:', respBody);

  let newCookie = state.rawCookie;
  if (resPost.headers['set-cookie']) {
    const cookies = resPost.headers['set-cookie'].map(c => c.split(';')[0]);
    newCookie = cookies.join('; ') + '; ' + state.rawCookie;
  }
  fs.writeFileSync('scripts/auth_cookie.txt', newCookie);

  // If login successful, fetch dashboard!
  const resDash = await request({ hostname: 'spotline888.org', path: '/coinht.php/dashboard?ref=addtabs', method: 'GET' }, null, newCookie);
  console.log('Dashboard status:', resDash.statusCode);
  fs.writeFileSync('scripts/dashboard.html', resDash.body);
  console.log('Saved dashboard to scripts/dashboard.html, size:', resDash.body.length);
}
