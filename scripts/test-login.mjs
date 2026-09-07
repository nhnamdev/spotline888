import https from 'https';

const options = {
  hostname: 'spotline888.org',
  path: '/coinht.php/index/login',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers set-cookie:', res.headers['set-cookie']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const tokenMatch = data.match(/name="__token__"\s+value="([^"]+)"/);
    console.log('Token:', tokenMatch ? tokenMatch[1] : 'none');
  });
});

req.on('error', (e) => console.error(e));
req.end();
