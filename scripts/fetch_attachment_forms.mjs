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
  console.log('Fetching general/attachment/add?addtabs=1...');
  const resAdd = await fetchUrl('https://spotline888.org/coinht.php/general/attachment/add?addtabs=1');
  console.log('Add status:', resAdd.status, 'size:', resAdd.body.length);
  fs.writeFileSync('scripts/attachment_add.html', resAdd.body);

  console.log('Fetching general/attachment/edit/ids/115?addtabs=1...');
  const resEdit = await fetchUrl('https://spotline888.org/coinht.php/general/attachment/edit/ids/115?addtabs=1');
  console.log('Edit status:', resEdit.status, 'size:', resEdit.body.length);
  fs.writeFileSync('scripts/attachment_edit.html', resEdit.body);

  console.log('Done.');
}

run().catch(console.error);
