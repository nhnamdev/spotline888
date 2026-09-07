import https from 'https';
import fs from 'fs';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf-8').trim();
console.log('Fetching /coinht.php/dashboard?addtabs=1 with cookie:', cookie);

const options = {
  hostname: 'spotline888.org',
  path: '/coinht.php/dashboard?addtabs=1',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Cookie': cookie,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = [];
  res.on('data', chunk => data.push(chunk));
  res.on('end', () => {
    const body = Buffer.concat(data);
    fs.writeFileSync('scripts/dashboard_inner.html', body);
    console.log('Saved dashboard_inner.html! Bytes:', body.length);
  });
}).on('error', console.error);
